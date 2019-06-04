<?php

namespace hipanel\server\order\yii;

use yii\bootstrap\BootstrapPluginAsset;
use yii\web\AssetBundle;

class ServerOrderAsset extends AssetBundle
{
    public $sourcePath = '@hipanel/server/order/dist';

    public $js = [
        'vendor.bb446716.js',
        'app.51d60a16.js',
    ];

    public $css = [];

    public $depends = [
        BootstrapPluginAsset::class,
    ];
}
