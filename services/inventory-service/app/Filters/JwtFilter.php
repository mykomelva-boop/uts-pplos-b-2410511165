<?php
namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;

class JwtFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return service('response')
                ->setStatusCode(401)
                ->setJSON(['message' => 'Token tidak ditemukan']);
        }

        $token = substr($authHeader, 7);

        $client = \Config\Services::curlrequest();
        try {
            $response = $client->get('http://localhost:3001/auth/profile', [
                'headers' => ['Authorization' => 'Bearer ' . $token],
                'http_errors' => false,
            ]);

            if ($response->getStatusCode() !== 200) {
                return service('response')
                    ->setStatusCode(401)
                    ->setJSON(['message' => 'Token tidak valid']);
            }
        } catch (\Exception $e) {
            return service('response')
                ->setStatusCode(500)
                ->setJSON(['message' => 'Auth service tidak dapat dihubungi']);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        
    }
}