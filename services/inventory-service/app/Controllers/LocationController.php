<?php
namespace App\Controllers;
use App\Models\LocationModel;
use CodeIgniter\RESTful\ResourceController;

class LocationController extends ResourceController
{
    protected $modelName = 'App\Models\LocationModel';
    protected $format    = 'json';

    public function index()
    {
        $page    = $this->request->getGet('page') ?? 1;
        $perPage = $this->request->getGet('per_page') ?? 10;
        $data    = $this->model->paginate($perPage, 'default', $page);
        return $this->respond([
            'data'     => $data,
            'page'     => (int)$page,
            'per_page' => (int)$perPage,
        ], 200);
    }

    public function show($id = null)
    {
        $location = $this->model->find($id);
        if (!$location) {
            return $this->failNotFound('Lokasi tidak ditemukan');
        }
        return $this->respond($location, 200);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        if (!$this->model->validate($data)) {
            return $this->failValidationErrors($this->model->errors());
        }
        $id = $this->model->insert($data);
        return $this->respondCreated(['id' => $id, 'message' => 'Lokasi berhasil dibuat']);
    }

    public function update($id = null)
    {
        $location = $this->model->find($id);
        if (!$location) {
            return $this->failNotFound('Lokasi tidak ditemukan');
        }
        $data = $this->request->getJSON(true);
        $this->model->update($id, $data);
        return $this->respond(['message' => 'Lokasi berhasil diupdate'], 200);
    }

    public function delete($id = null)
    {
        $location = $this->model->find($id);
        if (!$location) {
            return $this->failNotFound('Lokasi tidak ditemukan');
        }
        $this->model->delete($id);
        return $this->respondDeleted(['message' => 'Lokasi berhasil dihapus']);
    }
}