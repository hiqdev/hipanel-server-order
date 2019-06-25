<?php

namespace hipanel\server\order\yii\widgets;

use hipanel\helpers\Url;
use hipanel\server\order\yii\ServerOrderAsset;
use Yii;
use yii\base\Widget;
use yii\bootstrap\Progress;
use yii\helpers\Html;
use yii\web\View;

class ServerOrder extends Widget
{
    /**
     * @var array
     */
    public $configs = [];

    /**
     * @var array
     */
    public $osimages = [];

    /**
     * {@inheritDoc}
     */
    public function run()
    {
        $this->applyJs();

        return Html::tag('div', Progress::widget([
            'label' => Yii::t('hipanel', 'loading...'),
            'percent' => 100,
            'barOptions' => ['class' => 'progress-bar-success'],
            'options' => ['class' => 'active progress-striped', 'style' => 'width: 1024px; margin: 0 auto;'],
        ]), ['id' => 'server-order-app']);
    }

    private function applyJs(): void
    {
        $request = Yii::$app->request;
        ServerOrderAsset::register($this->view);
        $this->view->registerJs('!function(e){function r(r){for(var n,f,i=r[0],l=r[1],a=r[2],c=0,s=[];c<i.length;c++)f=i[c],o[f]&&s.push(o[f][0]),o[f]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(e[n]=l[n]);for(p&&p(r);s.length;)s.shift()();return u.push.apply(u,a||[]),t()}function t(){for(var e,r=0;r<u.length;r++){for(var t=u[r],n=!0,i=1;i<t.length;i++){var l=t[i];0!==o[l]&&(n=!1)}n&&(u.splice(r--,1),e=f(f.s=t[0]))}return e}var n={},o={2:0},u=[];function f(r){if(n[r])return n[r].exports;var t=n[r]={i:r,l:!1,exports:{}};return e[r].call(t.exports,t,t.exports,f),t.l=!0,t.exports}f.m=e,f.c=n,f.d=function(e,r,t){f.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},f.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},f.t=function(e,r){if(1&r&&(e=f(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(f.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var n in e)f.d(t,n,function(r){return e[r]}.bind(null,n));return t},f.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return f.d(r,"a",r),r},f.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},f.p="/";var i=window.webpackJsonp=window.webpackJsonp||[],l=i.push.bind(i);i.push=r,i=i.slice();for(var a=0;a<i.length;a++)r(i[a]);var p=l;t()}([]);', View::POS_END);
        $this->view->registerJsVar('hipanel_order_server', [
            'initialStates' => [
                'action' => Url::toRoute(['/server/order/add-to-cart-dedicated']),
                'location' => 'us',
                'language' => Yii::$app->language,
            ],
            'token' => [
                'name' => $request->csrfParam,
                'value' => $request->getCsrfToken(),
            ],
            'configs' => $this->buildConfigs(),
            'osImages' => $this->osimages,
        ]);
    }

    private function buildConfigs()
    {
        foreach ($this->configs as $config) {
            foreach ($config->prices as $location => $price) {
                if (!empty($config->{$location . '_server_ids'})) {
                    yield $location => [array_merge($config->toArray(), [
                        'price' => $price->firstAvailable->value,
                        'currency' => $price->firstAvailable->currency,
                        'support_price' => $price->supportPrice ?? 0,
                    ])];
                }
            }
        }
    }
}
