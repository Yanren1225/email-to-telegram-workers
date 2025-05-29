$body = @"
From: "John" <sender@example.com>
Reply-To: sender@example.com
To: recipient@example.com
Subject: Testing Email Workers Local Dev
Content-Type: text/html; charset="windows-1252"
X-Mailer: Curl
Date: Tue, 27 Aug 2024 08:49:44 -0700
Message-ID: <6114391943504294873000@ZSH-GHOSTTY>

<div data-ntes="ntes_mail_body_root" style="line-height:1.7;color:#000000;font-size:14px;font-family:Arial"><div>123</div></div>
"@

curl.exe --request POST 'http://localhost:8787/cdn-cgi/handler/email' `
  --url-query 'from=sender@example.com' `
  --url-query 'to=recipient@example.com' `
  --header 'Content-Type: application/json' `
  --data-raw $body
