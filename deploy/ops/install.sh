#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/opt/apps/personal-learning-site}"
cd "$APP_DIR"

install -m 644 deploy/ops/personal-learning-monitor.service /etc/systemd/system/
install -m 644 deploy/ops/personal-learning-monitor.timer /etc/systemd/system/
install -m 644 deploy/ops/personal-learning-backup.service /etc/systemd/system/
install -m 644 deploy/ops/personal-learning-backup.timer /etc/systemd/system/
install -m 644 deploy/ops/personal-learning-deploy.service /etc/systemd/system/
install -m 644 deploy/ops/personal-learning-deploy.timer /etc/systemd/system/

if [[ ! -f deploy/ops/monitor.env ]]; then
  cp deploy/ops/monitor.env.example deploy/ops/monitor.env
  chmod 600 deploy/ops/monitor.env
  echo "Created deploy/ops/monitor.env. Fill SMTP settings before enabling monitoring."
fi

systemctl daemon-reload
systemctl enable --now personal-learning-backup.timer
systemctl enable --now personal-learning-deploy.timer

echo "Automatic deployment and backup timers enabled."
echo "After configuring monitor.env, run:"
echo "  systemctl enable --now personal-learning-monitor.timer"
echo "  systemctl start personal-learning-monitor.service"
