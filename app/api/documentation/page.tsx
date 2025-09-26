import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"

export default function APIDocumentationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">API Documentation</h1>
            <p className="text-xl text-muted-foreground">
              Complete guide to integrating Trustidity's credential verification API
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="authentication">Auth</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              <TabsTrigger value="errors">Errors</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>
                    The Trustidity API allows you to verify educational and professional credentials programmatically
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Base URL</h4>
                      <code className="block bg-muted p-2 rounded text-sm">https://api.trustidity.com/v1</code>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Content Type</h4>
                      <code className="block bg-muted p-2 rounded text-sm">application/json</code>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Supported Credentials</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge>WAEC</Badge>
                      <Badge>JAMB</Badge>
                      <Badge>NECO</Badge>
                      <Badge>University Degrees</Badge>
                      <Badge>NMCN</Badge>
                      <Badge>NYSC</Badge>
                      <Badge>Professional Certs</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rate Limits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">100</div>
                      <div className="text-sm text-muted-foreground">requests/hour (Free)</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">1,000</div>
                      <div className="text-sm text-muted-foreground">requests/hour (Pro)</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">10,000</div>
                      <div className="text-sm text-muted-foreground">requests/hour (Enterprise)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="authentication" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Authentication</CardTitle>
                  <CardDescription>All API requests require authentication using Bearer tokens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Authorization Header</h4>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      {`Authorization: Bearer YOUR_API_KEY`}
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Example Request</h4>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      {`curl -X GET https://api.trustidity.com/v1/institutions \\
  -H "Authorization: Bearer sk_live_abc123..." \\
  -H "Content-Type: application/json"`}
                    </pre>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h5 className="font-semibold text-blue-900">API Key Security</h5>
                        <p className="text-sm text-blue-700">
                          Keep your API keys secure. Never expose them in client-side code or public repositories.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="endpoints" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Verification Endpoints</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>POST</Badge>
                        <code className="text-sm">/api/v1/verify</code>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Submit a new credential verification request</p>

                      <h5 className="font-semibold mb-2">Request Body</h5>
                      <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                        {`{
  "certificate_number": "WAE123456789",
  "credential_type": "waec",
  "institution": "WAEC",
  "candidate_name": "John Doe",
  "year": "2020",
  "webhook_url": "https://yourapp.com/webhook" // optional
}`}
                      </pre>

                      <h5 className="font-semibold mb-2 mt-4">Response</h5>
                      <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                        {`{
  "id": "ver_abc123",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00Z",
  "estimated_completion": "2024-01-15T10:35:00Z"
}`}
                      </pre>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">GET</Badge>
                        <code className="text-sm">/api/v1/verify/{"{id}"}</code>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Get verification status and results</p>

                      <h5 className="font-semibold mb-2">Response</h5>
                      <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                        {`{
  "id": "ver_abc123",
  "status": "completed",
  "result": {
    "verified": true,
    "candidate_name": "John Doe",
    "certificate_number": "WAE123456789",
    "institution": "WAEC",
    "year": "2020",
    "subjects": [
      {"subject": "Mathematics", "grade": "A1"},
      {"subject": "English Language", "grade": "B2"}
    ]
  },
  "completed_at": "2024-01-15T10:33:00Z"
}`}
                      </pre>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">GET</Badge>
                        <code className="text-sm">/api/v1/institutions</code>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">List all supported institutions</p>

                      <h5 className="font-semibold mb-2">Response</h5>
                      <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                        {`{
  "institutions": [
    {
      "code": "waec",
      "name": "West African Examinations Council",
      "type": "examination_body",
      "supported_credentials": ["ssce", "gce"]
    },
    {
      "code": "unilag",
      "name": "University of Lagos",
      "type": "university",
      "supported_credentials": ["bachelor", "master", "phd"]
    }
  ]
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="examples" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Code Examples</CardTitle>
                  <CardDescription>Implementation examples in popular programming languages</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="javascript" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                      <TabsTrigger value="php">PHP</TabsTrigger>
                      <TabsTrigger value="curl">cURL</TabsTrigger>
                    </TabsList>

                    <TabsContent value="javascript">
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                        {`// Submit verification request
const response = await fetch('https://api.trustidity.com/v1/verify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    certificate_number: 'WAE123456789',
    credential_type: 'waec',
    institution: 'WAEC',
    candidate_name: 'John Doe',
    year: '2020'
  })
});

const verification = await response.json();
console.log('Verification ID:', verification.id);

// Check verification status
const statusResponse = await fetch(\`https://api.trustidity.com/v1/verify/\${verification.id}\`, {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const result = await statusResponse.json();
console.log('Verification result:', result);`}
                      </pre>
                    </TabsContent>

                    <TabsContent value="python">
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                        {`import requests
import json

# Submit verification request
url = "https://api.trustidity.com/v1/verify"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "certificate_number": "WAE123456789",
    "credential_type": "waec",
    "institution": "WAEC",
    "candidate_name": "John Doe",
    "year": "2020"
}

response = requests.post(url, headers=headers, json=data)
verification = response.json()
print(f"Verification ID: {verification['id']}")

# Check verification status
status_url = f"https://api.trustidity.com/v1/verify/{verification['id']}"
status_response = requests.get(status_url, headers=headers)
result = status_response.json()
print(f"Verification result: {result}")`}
                      </pre>
                    </TabsContent>

                    <TabsContent value="php">
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                        {`<?php
// Submit verification request
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.trustidity.com/v1/verify",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer YOUR_API_KEY",
        "Content-Type: application/json"
    ],
    CURLOPT_POSTFIELDS => json_encode([
        "certificate_number" => "WAE123456789",
        "credential_type" => "waec",
        "institution" => "WAEC",
        "candidate_name" => "John Doe",
        "year" => "2020"
    ])
]);

$response = curl_exec($curl);
$verification = json_decode($response, true);
echo "Verification ID: " . $verification['id'];

// Check verification status
curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.trustidity.com/v1/verify/" . $verification['id'],
    CURLOPT_POST => false
]);

$statusResponse = curl_exec($curl);
$result = json_decode($statusResponse, true);
echo "Verification result: " . json_encode($result);
curl_close($curl);
?>`}
                      </pre>
                    </TabsContent>

                    <TabsContent value="curl">
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                        {`# Submit verification request
curl -X POST https://api.trustidity.com/v1/verify \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "certificate_number": "WAE123456789",
    "credential_type": "waec",
    "institution": "WAEC",
    "candidate_name": "John Doe",
    "year": "2020"
  }'

# Check verification status
curl -X GET https://api.trustidity.com/v1/verify/ver_abc123 \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                      </pre>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="webhooks" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Webhook Integration</CardTitle>
                  <CardDescription>Receive real-time notifications when verification status changes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Webhook Payload</h4>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      {`{
  "event": "verification.completed",
  "data": {
    "id": "ver_abc123",
    "status": "completed",
    "result": {
      "verified": true,
      "candidate_name": "John Doe",
      "certificate_number": "WAE123456789"
    },
    "completed_at": "2024-01-15T10:33:00Z"
  }
}`}
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Webhook Events</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">verification.pending</Badge>
                        <span className="text-sm">Verification request received</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">verification.processing</Badge>
                        <span className="text-sm">Verification in progress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">verification.completed</Badge>
                        <span className="text-sm">Verification completed successfully</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">verification.failed</Badge>
                        <span className="text-sm">Verification failed or error occurred</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h5 className="font-semibold text-yellow-900">Webhook Security</h5>
                        <p className="text-sm text-yellow-700">
                          Verify webhook signatures using the provided secret to ensure authenticity.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="errors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Error Handling</CardTitle>
                  <CardDescription>Understanding API error responses and status codes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="destructive">400</Badge>
                        <span className="font-semibold">Bad Request</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Invalid request parameters</p>
                      <pre className="bg-muted p-3 rounded text-xs">
                        {`{
  "error": {
    "code": "invalid_request",
    "message": "Missing required field: certificate_number"
  }
}`}
                      </pre>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="destructive">401</Badge>
                        <span className="font-semibold">Unauthorized</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Invalid or missing API key</p>
                      <pre className="bg-muted p-3 rounded text-xs">
                        {`{
  "error": {
    "code": "unauthorized",
    "message": "Invalid API key"
  }
}`}
                      </pre>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="destructive">429</Badge>
                        <span className="font-semibold">Rate Limited</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Too many requests</p>
                      <pre className="bg-muted p-3 rounded text-xs">
                        {`{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded. Try again in 60 seconds."
  }
}`}
                      </pre>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="destructive">500</Badge>
                        <span className="font-semibold">Server Error</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Internal server error</p>
                      <pre className="bg-muted p-3 rounded text-xs">
                        {`{
  "error": {
    "code": "internal_error",
    "message": "An unexpected error occurred. Please try again."
  }
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Status Indicators</h4>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">completed - Verification successful</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">pending - Awaiting processing</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">processing - Verification in progress</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm">failed - Verification failed</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-12">
            <Link href="/api/access">
              <Button size="lg">Get API Access</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
