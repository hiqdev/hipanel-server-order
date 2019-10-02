<?php

namespace hipanel\server\order\yii;

use hipanel\helpers\StringHelper;
use Yii;
use yii\bootstrap\BootstrapAsset;
use yii\helpers\FileHelper;
use yii\web\AssetBundle;

class ServerOrderAsset extends AssetBundle
{
    public $sourcePath = '@hipanel/server/order/dist';

    public $depends = [
        BootstrapAsset::class,
    ];

    public function init()
    {
        parent::init();
        $files = array_map('basename', FileHelper::findFiles(Yii::getAlias($this->sourcePath), [
            'only' => ['vendor.*.js', 'app.*.js', 'vendor.*.css', 'app.*.css'],
            'caseSensitive' => true,
            'recursive' => false,
        ]));
        rsort($files);
        if (is_array($files) && !empty($files)) {
            foreach ($files as $file) {
                if (StringHelper::endsWith($file, 'js')) {
                    $this->js[] = $file;
                }
                if (StringHelper::endsWith($file, 'css')) {
                    $this->css[] = $file;
                }
            }
        }
    }
}
