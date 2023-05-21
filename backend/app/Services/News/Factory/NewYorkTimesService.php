<?php

namespace App\Services\News\Factory;

use App\Services\News\NewsServiceInterface;

use Illuminate\Support\Facades\Http;

class NewYorkTimesService implements NewsServiceInterface
{
    private $client;

    public function __construct()
    {
        $this->client = Http::newYorkTimes();
    }

    public function getHeadlines($page = 1, $pageSize = 50)
    {
        $response = $this->client
        ->withOptions([
            'query' => [
                'page' => $page,
                'page_size' => $pageSize,
            ]
        ])
        ->get('/articlesearch.json');

        return $response;
    }

    public function search($query, $page = 1, $pageSize = 50)
    {
        $response = $this->client->withOptions([
            'query' => [
                'q' => $query,
                'page' => $page,
                'page_size' => $pageSize,
            ]
        ])->get('/articlesearch.json');

        return $response;
    }

    public function normalizeData($data) {
        if (empty($data)) {
            return [];
        }

        $articles = $data['response']['docs'] ?? [];
        $normalizedData = [];

        foreach ($articles as $article) {
            $normalizedData[] = [
                'provider' => 'NewYorkTimes',
                'id' => get_array_value_safely($article, '_id'),
                'title' => get_array_value_safely($article, 'headline.main'),
                'description' => get_array_value_safely($article, 'abstract'),
                'url' => get_array_value_safely($article, 'web_url'),
                'image' => $this->getImageUrl($article),
                'date' => get_array_value_safely($article, 'pub_date'),
                'content' => get_array_value_safely($article, 'lead_paragraph'),
                'source' => get_array_value_safely($article, 'source'),
                'author' => get_array_value_safely($article, 'byline.original'),
                'category' => get_array_value_safely($article, 'section_name'),
            ];
        }

        return $normalizedData;
    }

    private function getImageUrl ($article) {
        $host = 'https://www.nytimes.com/';
        $imageUrl = get_array_value_safely($article, 'multimedia.0.url');

        if ($imageUrl) {
            return $host . $imageUrl;
        }

        return null;
    }

    public function getOne($id)
    {
        $response = $this
            ->client
            ->withOptions([
                'query' => [
                    'fq' => '_id:("' . $id . '")',
                ]
            ])
            ->get('/articlesearch.json');

        return $response;
    }
}
