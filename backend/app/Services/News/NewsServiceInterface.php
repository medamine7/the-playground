<?php

namespace App\Services\News;

interface NewsServiceInterface
{
    public function getHeadlines($page = 1, $pageSize = 50);

    public function normalizeData($data);

    public function search($query, $page = 1, $pageSize = 50);

    public function getOne($id);
}
