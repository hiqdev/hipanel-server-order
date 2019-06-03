<?php

namespace hipanel\server\order\yii;

use yii\bootstrap\BootstrapPluginAsset;
use yii\web\AssetBundle;

class ServerOrderAsset extends AssetBundle
{
    public $sourcePath = '@hipanel/server/order/dist';

    public $js = [
        'vendor.ecc6ffc9.js',
        'app.675b1a0a.js',
    ];

    public $css = [
        'app.bed58901.css',
    ];

    public $depends = [
        BootstrapPluginAsset::class,
    ];
}
