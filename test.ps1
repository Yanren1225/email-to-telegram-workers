$boundary = "----=_NextPart_000_0000_01D6C4A6.5C6F8B80"
$body = @"
From: "John" <sender@example.com>
To: recipient@example.com
Subject: Testing Email Workers Local Dev With Attachment
Message-ID: <test123@example.com>
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="$boundary"

--$boundary
Content-Type: text/html; charset="utf-8"

<div>这是一封带附件的测试邮件</div>

--$boundary
Content-Type: text/plain; name="test.txt"
Content-Disposition: attachment; filename="test.txt"
Content-Transfer-Encoding: base64

aGVsbG8K
--$boundary--
"@

curl.exe --request POST 'http://localhost:8787/cdn-cgi/handler/email' `
  --url-query 'from=sender@example.com' `
  --url-query 'to=recipient@example.com' `
  --header 'Content-Type: application/json' `
  --data-raw $body