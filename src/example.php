<?php

final class ApiClient
{
    /**
     * @var string
     */
    public static $apiUrl = 'https://beta-hiapi.advancedhosting.com/';

    /**
     * @var resource
     */
    private $curl;

    public function __construct(string $path)
    {
        if ($curl = curl_init()) {
            curl_setopt($curl, CURLOPT_URL, self::$apiUrl . $path);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_POST, true);
            $this->curl = $curl;
        }
    }

    public function __destruct()
    {
        curl_close($this->curl);
    }

    public function setQuery(array $query = []): self
    {
        curl_setopt($this->curl, CURLOPT_POSTFIELDS, http_build_query($query));

        return $this;
    }

    public function getData(): array
    {
        return json_decode(curl_exec($this->curl));
    }
}

// Make requests
$configs = (new ApiClient('configsGetAvailable'))->setQuery(['with_prices' => true, 'seller' => 'dsr'])->getData();
$osimages = (new ApiClient('osimagesSearch'))->setQuery(['type' => 'dedicated', 'seller' => 'dsr'])->getData();
// Group `configs` by location
$configsByLocation = [];
foreach ($configs as $config) {
    $configsByLocation[$config->location][] = $config;
}
// Add `hipanel_server_order` variable in global scope
$js = sprintf('<script type="text/javascript">var %s = %s;</script>', 'window.hipanel_server_order', json_encode([
    'initialStates' => [
        'action' => ApiClient::$apiUrl . 'server/order/add-to-cart-dedicated',
        'location' => 'us',
        'language' => 'en',
    ],
    'pathToIcons' => null,
    'configs' => $configsByLocation,
    'osImages' => $osimages,
], JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS));
$indexHtml = file_get_contents('index.html');
echo strtr($indexHtml, ['</head>' => $js . '</head>']);