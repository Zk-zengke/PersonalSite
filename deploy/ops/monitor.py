#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import shutil
import smtplib
import socket
import ssl
import subprocess
import time
import urllib.request
from email.message import EmailMessage
from pathlib import Path

APP_DIR = Path(os.environ.get("APP_DIR", "/opt/apps/personal-learning-site"))
CONFIG_FILE = Path(os.environ.get("MONITOR_ENV", APP_DIR / "deploy/ops/monitor.env"))
STATE_FILE = Path("/var/lib/personal-learning-monitor/state.json")


def load_env(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip()
    return values


def check_url(name: str, url: str, max_seconds: float) -> tuple[bool, str]:
    started = time.monotonic()
    try:
        request = urllib.request.Request(url, headers={"User-Agent": "learning-site-monitor/1.0"})
        with urllib.request.urlopen(request, timeout=max(10, max_seconds + 3)) as response:
            elapsed = time.monotonic() - started
            if response.status >= 400:
                return False, f"{name}: HTTP {response.status}"
            if elapsed > max_seconds:
                return False, f"{name}: 响应过慢 {elapsed:.2f}s，阈值 {max_seconds:.2f}s"
            return True, f"{name}: 正常 {elapsed:.2f}s"
    except Exception as error:
        return False, f"{name}: 请求失败 {error}"


def check_containers() -> tuple[bool, str]:
    command = [
        "docker", "compose", "--env-file", ".env",
        "-f", "docker-compose.prod.yml", "ps",
        "--status", "running", "--services",
    ]
    result = subprocess.run(command, cwd=APP_DIR, capture_output=True, text=True, timeout=30)
    running = set(result.stdout.split())
    expected = {"postgres", "api", "web", "caddy"}
    missing = sorted(expected - running)
    if result.returncode != 0 or missing:
        return False, f"容器异常，未运行: {', '.join(missing) or result.stderr.strip()}"
    return True, "容器: postgres/api/web/caddy 全部运行"


def check_disk(max_percent: int) -> tuple[bool, str]:
    usage = shutil.disk_usage("/")
    percent = round(usage.used / usage.total * 100, 1)
    return percent < max_percent, f"磁盘使用率: {percent}%（阈值 {max_percent}%）"


def send_mail(config: dict[str, str], subject: str, body: str) -> None:
    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = config["MAIL_FROM"]
    message["To"] = config["MAIL_TO"]
    message.set_content(body)

    host = config["SMTP_HOST"]
    port = int(config.get("SMTP_PORT", "465"))
    security = config.get("SMTP_SECURITY", "ssl").lower()
    if security == "ssl":
        with smtplib.SMTP_SSL(host, port, context=ssl.create_default_context(), timeout=20) as smtp:
            smtp.login(config["SMTP_USERNAME"], config["SMTP_PASSWORD"])
            smtp.send_message(message)
    else:
        with smtplib.SMTP(host, port, timeout=20) as smtp:
            smtp.starttls(context=ssl.create_default_context())
            smtp.login(config["SMTP_USERNAME"], config["SMTP_PASSWORD"])
            smtp.send_message(message)


def main() -> None:
    config = load_env(CONFIG_FILE)
    checks = [
        check_url("网站首页", config["SITE_URL"], float(config.get("SITE_MAX_SECONDS", "3"))),
        check_url("健康接口", config["API_URL"], float(config.get("API_MAX_SECONDS", "2"))),
        check_containers(),
        check_disk(int(config.get("DISK_MAX_PERCENT", "85"))),
    ]
    healthy = all(result for result, _ in checks)
    details = "\n".join(f"- {detail}" for _, detail in checks)
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)

    previous = {}
    if STATE_FILE.exists():
        try:
            previous = json.loads(STATE_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            previous = {}

    now = int(time.time())
    repeat_seconds = int(config.get("ALERT_REPEAT_MINUTES", "60")) * 60
    should_notify = (
        healthy != previous.get("healthy")
        or (not healthy and now - int(previous.get("notifiedAt", 0)) >= repeat_seconds)
    )

    mail_enabled = config.get("MAIL_ENABLED", "false").lower() == "true"
    if should_notify and mail_enabled:
        status = "恢复正常" if healthy else "出现异常"
        subject = f"[个人学习站] {status} - {socket.gethostname()}"
        send_mail(config, subject, f"检测时间：{time.strftime('%F %T')}\n\n{details}\n")
        notified_at = now
    elif should_notify:
        print("邮件告警尚未启用；检测结果仅写入 systemd 日志。")
        notified_at = int(previous.get("notifiedAt", 0))
    else:
        notified_at = int(previous.get("notifiedAt", 0))

    STATE_FILE.write_text(
        json.dumps({"healthy": healthy, "checkedAt": now, "notifiedAt": notified_at}, ensure_ascii=False),
        encoding="utf-8",
    )
    print(details)
    if not healthy:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
