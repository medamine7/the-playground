<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Http;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->setHttpMacros();
    }

    private function setHttpMacros()
    {
        // NewsApi
        Http::macro('newsApi', function () {
            $newsApiKey = config('services.newsapi.key');
            $newsApiHost = config('services.newsapi.host');

            return Http::withHeaders([
                'X-Api-Key' => $newsApiKey,
            ])->baseUrl($newsApiHost)->acceptJson();
        });

        // TheGuardian
        Http::macro('theGuardian', function () {
            $theGuardianKey = config('services.theguardian.key');
            $theGuardianHost = config('services.theguardian.host');

            return Http::withOptions([
                'query' => [
                    'api-key' => $theGuardianKey,
                ]
            ])->baseUrl($theGuardianHost)->acceptJson();
        });

        // NewYorkTimes
        Http::macro('newYorkTimes', function () {
            $newYorkTimesKey = config('services.newyorktimes.key');
            $newYorkTimesHost = config('services.newyorktimes.host');

            return Http::withOptions([
                'query' => [
                    'api-key' => $newYorkTimesKey,
                ]
            ])->baseUrl($newYorkTimesHost)->acceptJson();
        });
    }
}
