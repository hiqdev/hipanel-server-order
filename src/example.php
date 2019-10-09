<?php

final class ApiClient
{
    /**
     * @var string
     */
    public $apiUrl = 'https://hiapi.advancedhosting.com/';

    /**
     * @var resource
     */
    private $curl;

    public function __construct(string $path)
    {
        if ($curl = curl_init()) {
            curl_setopt($curl, CURLOPT_URL, $this->apiUrl . $path);
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

    public function getData()
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
$js = sprintf('<script type="text/javascript">var %s = %s;</script>', 'hipanel_server_order', json_encode([
    'initialStates' => [
        'action' => 'https://hipanel.advancedhosting.com/server/order/add-to-cart-dedicated',
        'location' => 'nl',
        'language' => 'en',
    ],
    'pathToIcons' => null,
    'configs' => $configsByLocation,
    'osImages' => $osimages,
], JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS));
$indexHtml = file_get_contents('index.html');
$lsHtml = <<<"HTML"
<div class="use-bootstrap">
    <div class="container">
        <div class="row">
            <div class="col-12 mt-5 location-switcher">
                <div class="form-check">
                    <input class="form-check-input location-switcher-input" type="radio" name="locationRadios" id="locationRadios1" value="nl" checked>
                    <label class="form-check-label" for="locationRadios1">Netherlands</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input location-switcher-input" type="radio" name="locationRadios" id="locationRadios2" value="us">
                    <label class="form-check-label" for="locationRadios2">USA</label>
                </div>
            </div>
        </div>
    </div>
</div>
HTML;
$lsJs = <<<"JS"
<script type="text/javascript">
    var radios = document.querySelectorAll(".location-switcher-input"), x = radios.length;
    while (x--) {
        radios[x].addEventListener('click', (evt) => {
            hipanel_server_order_app.setLocation(evt.target.value);
        })
    }
</script>
JS;
$indexHtml = strtr($indexHtml, ['</head>' => $js . '</head>']);
$indexHtml = strtr($indexHtml, ['<body>' => $lsHtml . '<body>']);
$indexHtml = strtr($indexHtml, ['</body>' => $lsJs . '</body>']);

echo $indexHtml;
