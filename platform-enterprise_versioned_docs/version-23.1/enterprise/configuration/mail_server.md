---
title: "Mail server configuration"
description: Configuration options for mail servers
date: "21 Apr 2023"
tags: [mail, configuration]
---

## Mail server configuration

You can specify the configuration settings for email using either environment variables, or the `tower.yml` file.

Note: To configure proxy settings, the `tower.yml` file must be used (see below).

<details>
  <summary>tower.env</summary>

```env
TOWER_CONTACT_EMAIL=hello@foo.com
TOWER_SMTP_HOST=your.smtphost.com
TOWER_SMTP_USER=your_smtp_user
TOWER_SMTP_PASSWORD=your_smtp_password
TOWER_SMTP_PORT=587
TOWER_SMTP_AUTH=true
TOWER_SMTP_STARTTLS_ENABLED=true
TOWER_SMTP_STARTTLS_REQUIRED=true
```

</details>

<details>
  <summary>tower.yml</summary>

```yaml
mail:
  smtp:
    host: "your.smtphost.com"
    port: "587"
    auth: "true"
    user: "your_smtp_user"
    password: "your_smtp_password"
    starttls:
      enable: true
      required: true
    proxy:
      host: "proxy.com"
      port: "5566"
```

</details>
