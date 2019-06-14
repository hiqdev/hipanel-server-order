<?php

namespace hipanel\server\order\yii;

use Yii;
use yii\bootstrap\BootstrapPluginAsset;
use yii\helpers\FileHelper;
use yii\web\AssetBundle;

class ServerOrderAsset extends AssetBundle
{
    public $sourcePath = '@hipanel/server/order/dist';

    public $depends = [
        BootstrapPluginAsset::class,
    ];

    public function init()
    {
        parent::init();
        $files = array_map('basename', FileHelper::findFiles(Yii::getAlias($this->sourcePath), [
            'only' => ['vendor.*.js', 'app.*.js'],
            'caseSensitive' => true,
            'recursive' => false,
        ]));
        rsort($files);
        if (is_array($files) && !empty($files)) {
            $this->js = $files;
        }
    }
}
