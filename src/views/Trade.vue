<template>
  <div class="home">
    <div class="header" style="padding-right: 20px;">
      <div style="flex:1;"><h3 style="font-size: 18px;">
        {{ trade === 1 ? $t('lever.transaction') : $t('miscro.transaction') }}</h3></div>
      <div class="flex alcenter" @click="trade = trade === 2?1:2">
        <mu-button @click="" icon>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-qiehuan1"></use>
          </svg>
        </mu-button>
        <a class="subtitle bold">{{ trade === 2 ? $t('lever.transaction') : $t('miscro.transaction') }}</a>
      </div>
    </div>
    <div class="container-my" style="overflow: auto">
      <div class="flex alcenter" style="padding-left: 5px;">
        <mu-button @click="open=!open" icon>
          <mu-icon color="primary" size="24" value=":icon-bizhong"></mu-icon>
        </mu-button>

        <span style="font-size: 16px;">{{ currency_name }}/USDT</span>
        <div style="margin-left: 20px;">
          <mu-button @click="$router.push('/kline?from=trade&mode='+trade)" icon>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-Kxiantu1"></use>
            </svg>
          </mu-button>
        </div>
        <mu-drawer width="80%" :open.sync="open" :docked="docked" :right="position === 'right'">
          <h4>USDT</h4>
          <mu-list>
            <mu-container v-for="item in quotationsList">
              <mu-list-item button @click="changeCurrency(item.currency_name,item.currency_id)">
                <mu-list-item-action>
                  <mu-avatar size="20">
                    <img :src="item.logo">
                  </mu-avatar>
                </mu-list-item-action>
                <mu-list-item-title>
                  <mu-flex class="flex-wrapper" align-items="center">
                    <mu-flex class="flex-demo" style="width: 20%;" justify-content="start">{{
                        item.currency_name
                      }}
                    </mu-flex>
                    <mu-flex class="flex-demo" style="width: 30%;" justify-content="center"><span
                        style="font-size: 14px;" :class="item.change>0?'green':'red'">{{ item.change }}%</span>
                    </mu-flex>
                    <mu-flex class="flex-demo" justify-content="center" fill><span
                        style="font-size: 14px;">{{ item.now_price|numberFixed }}</span></mu-flex>
                  </mu-flex>
                </mu-list-item-title>
              </mu-list-item>
              <mu-divider shallow-inset/>
            </mu-container>
          </mu-list>
        </mu-drawer>
      </div>
      <div class="flex" style="padding:0 20px;">
        <div class="flex column lever" v-if="trade===1" style="max-width: 50%;">
          <div class="flex">
            <div class="flex1" style="padding: 0 20px;">
              <mu-button class="bold" @click="tradeMode='buy'" flat :color="tradeMode==='buy'?'success':'normal'"
                         style="width: 50%; min-width: 20px;">{{ $t('lever.dmore') }}
              </mu-button>
              <mu-button class="bold" @click="tradeMode='sell'" flat :color="tradeMode==='sell'?'error':'normal'"
                         style="width: 50%; min-width: 20px;">{{ $t('lever.dshort') }}
              </mu-button>
            </div>
          </div>
          <div style="overflow:hidden;">
            <div class="flex all">
              <mu-select :color="tradeMode==='buy'?'success':'error'" :label="$t('miscro.mode')" v-model="priceMode"
                         full-width>
                <mu-option v-for="(option,index) in options" :key="index" :label="option.label"
                           :value="option.value"></mu-option>
              </mu-select>
            </div>

            <div class="flex all">
              <mu-text-field :type="priceMode==='shijia'?'text':'number'"
                             v-model="priceMode==='shijia'?bestPrice:price" :readonly="priceMode==='shijia'"
                             :color="tradeMode==='buy'?'success':'error'" help-text=""
                             suffix="USDT" :label="$t('cuy.price')"></mu-text-field>
            </div>
            <div class="flex all">
              <div class="flex flx1">
                <mu-select :color="tradeMode==='buy'?'success':'error'" :label="$t('lever.timed')" v-model="tmuti"
                           full-width>
                  <mu-option v-for="(option,index) in multi" :key="index" :label="option.value"
                             :value="option.value"></mu-option>
                </mu-select>
              </div>
              <div style="width: 30px;"></div>
              <div class="flex flx1 inputshare">
                <mu-auto-complete :data="shared" help-text=" "
                                  :color="tradeMode==='buy'?'success':'error'" :label="$t('lever.hands')"
                                  :max-search-results="6" v-model="tshared" :suffix="$t('hand')" open-on-focus>
                  <template slot-scope="scope">
                    <mu-list-item-content :color="tradeMode==='buy'?'success':'error'"
                                          v-html="scope.highlight"></mu-list-item-content>
                  </template>
                </mu-auto-complete>
              </div>
            </div>
            <div class="currency_title tall" style="margin-top:-10px; margin-left: 0; color:rgba(0,0,0,.54)!important;">
              {{ '1' + $t('hand') + ' ≈ ' + shareNum.toFixed(2) + ' USDT' }}
            </div>
            <div class="mt5">
              <div class="left flex alcenter" style="text-align: left; line-height: 20px;">
                <div class="subtitle nowrap" style="color:rgba(0,0,0,.54)">{{ $t('center.available') }}</div>
                <div class="flex1 talr nowrap currency_title">{{
                    (Number(user_lever).toFixed(2))
                  }}<i class="currency_title">USDT</i>
                </div>
              </div>
              <div class="left flex alcenter" style="text-align: left; line-height: 20px;">
                <div class="subtitle nowrap" style="color:rgba(0,0,0,.54)">{{ $t('lever.contractVal') }}</div>
                <div class="flex1 talr nowrap currency_title">{{
                    (Number(tradeAmount).toFixed(2))
                  }}<i class="currency_title">USDT</i>
                </div>
              </div>
              <div class="left flex alcenter" style="text-align: left; line-height: 20px;">
                <div class="subtitle nowrap" style="color:rgba(0,0,0,.54)">{{ $t('lever.bail') }}</div>
                <div class="flex1 talr nowrap currency_title">{{
                    (Number(bons).toFixed(2))
                  }}<i class="currency_title">USDT</i>
                </div>
              </div>
              <div class="left flex alcenter" style="text-align: left; line-height: 20px;">
                <div class="subtitle nowrap " style="color:rgba(0,0,0,.54)">{{ $t('lever.charge') }}</div>
                <div class="flex1 talr nowrap currency_title">{{ (Number(fee).toFixed(2)) }}<i class="currency_title">USDT</i>
                </div>
              </div>
            </div>
            <div>
              <mu-button class="mt5" @click="openAlert=true" :color="tradeMode==='buy'?'success':'error'" full-width>
                {{ tradeMode == 'buy' ? $t('lever.domore') : $t('lever.doshort') }} {{ currency_name }}
              </mu-button>
            </div>
          </div>
        </div>

        <div class="flex column" v-if="trade===2" style="max-width: 50%;">
          <div class="flex">
            <div class="flex1" style="padding: 0 20px;">
              <mu-button class="bold" @click="tradeMode='buy'" flat :color="tradeMode==='buy'?'success':'normal'"
                         style="width: 50%; min-width: 20px;">{{ $t('miscro.up') }}
              </mu-button>
              <mu-button class="bold" @click="tradeMode='sell'" flat :color="tradeMode==='sell'?'error':'normal'"
                         style="width: 50%; min-width: 20px;">{{ $t('miscro.down') }}
              </mu-button>
            </div>
          </div>
          <div>
            <div class="flex all">
              <mu-select :color="tradeMode==='buy'?'success':'error'" :label="$t('miscro.mode')"
                         v-model="secondsMoneyMode" full-width>
                <mu-option v-for="(option,index) in secondModes" :key="index" :label="option.name"
                           :value="index"></mu-option>
              </mu-select>
            </div>
            <div class="flex all">
              <mu-auto-complete :data="secondsNumbers"
                                :color="tradeMode==='buy'?'success':'error'" :label="$t('miscro.num')"
                                :suffix="secondModes[secondsMoneyMode].name" :max-search-results="6" v-model="tsnumber"
                                open-on-focus>
              </mu-auto-complete>


            </div>
            <div class="flex all mb15">
              <mu-select :help-text="$t('miscro.rate') +' '+ tsrate+'%'" :color="tradeMode==='buy'?'success':'error'"
                         :label="$t('lever.openTime')" v-model="tstime"
                         full-width>
                <mu-option v-for="(option,index) in secondTimes" :key="index"
                           :label="option.seconds.toString() + ' Sec'"
                           :value="index"></mu-option>
              </mu-select>

            </div>
            <div>
              <div class="left flex alcenter" style="text-align: left; line-height: 20px;">
                <div class="subtitle nowrap" style="color:rgba(0,0,0,.54)">{{ $t('center.available') }}</div>
                <div class="flex1 talr nowrap currency_title">
                  {{ tswallet.micro_balance|numberFixed(tswallet.currency_name === 'BTC' ? 6 : 2) }}
                  <i class="currency_title">{{ tswallet.currency_name }}</i>
                </div>
              </div>
            </div>
            <div class="mt5">
              <mu-button class="mt10" @click="openAlert=true" :color="tradeMode==='buy'?'success':'error'" full-width>
                {{ tradeMode === 'buy' ? $t('miscro.up') : $t('miscro.down') }} {{ currency_name }}
              </mu-button>
            </div>
          </div>
        </div>

        <div class="flex flex-column" style="min-width: 50%;">
          <div class="line green talc" style="line-height: 38px;">
            <span style="font-size: 16px;">{{ newData|numberFixed(4) }}</span> <span
              class="currency_title"> USDT</span>
          </div>
          <div class="flex ft12" style="line-height: 30px; text-indent: 12px; color: #666;">
            <div class="flex1">{{ $t('td.price') }}</div>
            <div class="flex1">{{ $t('td.num') }}</div>
          </div>
          <div class="flex flex1">
            <ul class="list-item ft12 tc">
              <li class="curPer red" v-for="(out,index) in outList" v-if="index<6" :key="out.id">
                <span>{{ out[0] | numberFixed }}</span>
                <span>{{ out[1] | numberFixed }}</span>
                <span class="info-shadow selli" :style="{width:(((out[1]/sellMaxValue-0)*100))+'%'}"></span>
              </li>
              <mu-divider inset color="rgba(0,0,0,.3)" style="margin:8px 0;"></mu-divider>
              <li class="curPer green" v-for="(buy,index) in inList" v-if="index<6" :key="index">
                <span>{{ buy[0] | numberFixed }}</span>
                <span>{{ buy[1] | numberFixed }}</span>
                <span class="info-shadow" :style="{width:(buy[1]/inMaxValue-0)*100+'%'}"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div style="width:100%; height: 5px; margin:10px 0; " :style="getDayColor('background-color')"></div>

      <!--列表-->
      <div style="padding:0 20px; padding-top: 0;">

        <mu-container v-if="trade===1">
          <mu-tabs :value.sync="loadType" class="bold" inverse color="primary" indicator-color="white" center>
            <mu-tab>{{ $t('header.current') }}</mu-tab>
            <mu-tab>{{ $t('lever.lvchi') }}</mu-tab>
            <mu-tab>{{ $t('lever.closed') }}</mu-tab>
            <mu-tab>{{ $t('lever.revoked') }}</mu-tab>
          </mu-tabs>
          <div class="demo-text" v-if="loadType === 0">
            <div style="margin:10px 0;" v-for="item in list_content">
              <div class="flex alcenter">
                <span class="flex1" style="text-align: left">
                  <span class="bold" :class="item.type===1?'green':'red'"
                        style="font-size: 14px;">{{
                      item.type === 1 ? $t('lever.dmore') : $t('lever.dshort')
                    }}</span> <i
                    class="subtitle" style="font-style: normal;">{{ item.transaction_time.substring(5) }}</i>
                  </span>
                <span>
                <mu-button small class="ml3" @click="openCancel=true;cancelId=item.id"
                           color="error">
                  {{ $t('lever.revoke') }}</mu-button>
              </span>
              </div>
              <div class="flex mt5">
                <div class="tall" style="width: 33%">
                  <div class="subtitle">
                    {{ item.symbol }}
                  </div>
                  <div class="subb">
                    {{ item.origin_price|numberFixed(2) }}
                  </div>
                </div>
                <div class="talc" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.hands') }} * {{ $t('lever.timed') }}
                  </div>
                  <div class="subb">
                    {{ item.share }} * {{ item.multiple }}
                  </div>
                </div>
                <div class="talr" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.nowPrice') }}
                  </div>
                  <div class="subb" :class="item.profits>0?'green':'red'">
                    {{ item.update_price|numberFixed(2) }}
                  </div>
                </div>

              </div>
              <div class="flex mt5">
                <div class="tall" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.bail') }}
                  </div>
                  <div class="subb">
                    {{ item.origin_caution_money|numberFixed(2) }}
                  </div>
                </div>
                <div class="talc" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.charge') }}
                  </div>
                  <div class="subb">
                    {{ item.trade_fee|numberFixed(2) }}
                  </div>
                </div>
                <div class="talr" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('td1.status') }}
                  </div>
                  <div class="subb">

                    {{ $t('lever.listin') }}
                  </div>
                </div>
              </div>
              <div class="flex mt5">
                <div class="tall" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.styPrice') }}
                  </div>
                  <div class="subb">
                    {{ item.target_profit_price|numberFixed(2) }}
                  </div>
                </div>
                <div class="talc" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.stsPrice') }}
                  </div>
                  <div class="subb">
                    {{ item.stop_loss_price|numberFixed(2) }}
                  </div>
                </div>

                <div class="talr" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.expectProfit') }}
                  </div>
                  <div class="subb" :class="item.profits>0?'green':'red'">
                    {{ item.profits|numberFixed(2) }}
                  </div>
                </div>
              </div>
              <mu-divider></mu-divider>
            </div>
            <div class="mt20" v-if="list_content.length<=0">
              <svg color="gray" class="icon" font-size="40px" aria-hidden="true">
                <use xlink:href="#icon-empty1"></use>
              </svg>
              <p class="subtitle">{{ $t('tpc.nodata') }}</p>
            </div>
          </div>
          <div class="demo-text" v-if="loadType === 1">
            <div style="margin:10px 0;" v-for="item in list_content">
              <div class="flex alcenter">
                <span class="flex1" style="text-align: left">
                  <span class="bold" :class="item.type===1?'green':'red'"
                        style="font-size: 14px;">{{
                      item.type === 1 ? $t('lever.dmore') : $t('lever.dshort')
                    }}</span> <i
                    class="subtitle" style="font-style: normal;">{{ item.transaction_time.substring(5) }}</i>
                  </span>
                <span>
                <mu-button small class="ml3" @click="pingId=item.id;openPing=true"
                           color="error">
                  {{ $t('lever.ping') }}</mu-button>
              </span>
              </div>
              <div class="flex mt5">
                <div class="tall" style="width: 33%">
                  <div class="subtitle">
                    {{ item.symbol }}
                  </div>
                  <div class="subb">
                    {{ item.origin_price|numberFixed(2) }}
                  </div>
                </div>
                <div class="talc" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.hands') }} * {{ $t('lever.timed') }}
                  </div>
                  <div class="subb">
                    {{ item.share }} * {{ item.multiple }}
                  </div>
                </div>
                <div class="talr" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.nowPrice') }}
                  </div>
                  <div class="subb" :class="item.profits>0?'green':'red'">
                    {{ item.update_price|numberFixed(2) }}
                  </div>
                </div>

              </div>
              <div class="flex mt5">
                <div class="tall" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.bail') }}
                  </div>
                  <div class="subb">
                    {{ item.origin_caution_money|numberFixed(2) }}
                  </div>
                </div>
                <div class="talc" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.charge') }}
                  </div>
                  <div class="subb">
                    {{ item.trade_fee|numberFixed(2) }}
                  </div>
                </div>
                <div class="talr" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('td1.do') }}
                  </div>
                  <div class="subb">

                    <mu-button flat small
                               @click="winPriceY=lossPriceY=0;openSet=true;setId=item.id;lossPrice=winPrice=Number(item.price).toFixed(2)"
                               color="primary">
                      {{ $t('lever.setloss') }}
                    </mu-button>
                  </div>
                </div>
              </div>
              <div class="flex mt5">
                <div class="tall" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.styPrice') }}
                  </div>
                  <div class="subb">
                    {{ item.target_profit_price|numberFixed(2) }}
                  </div>
                </div>
                <div class="talc" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.stsPrice') }}
                  </div>
                  <div class="subb">
                    {{ item.stop_loss_price|numberFixed(2) }}
                  </div>
                </div>

                <div class="talr" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.expectProfit') }}
                  </div>
                  <div class="subb" :class="item.profits>0?'green':'red'">
                    {{ item.profits|numberFixed(2) }}
                  </div>
                </div>
              </div>
              <mu-divider></mu-divider>
            </div>
            <div class="mt20" v-if="list_content.length<=0">
              <svg color="gray" class="icon" font-size="40px" aria-hidden="true">
                <use xlink:href="#icon-empty1"></use>
              </svg>
              <p class="subtitle">{{ $t('tpc.nodata') }}</p>
            </div>
          </div>

          <div class="demo-text" v-if="loadType === 2">
            <div style="margin:10px 0;" v-for="item in list_content">
              <div class="flex alcenter">
                <span class="flex1" style="text-align: left">
                  <span class="bold" :class="item.type===1?'green':'red'"
                        style="font-size: 14px;">{{
                      item.type === 1 ? $t('lever.dmore') : $t('lever.dshort')
                    }}</span> <i
                    class="subtitle" style="font-style: normal;">{{ item.transaction_time.substring(5) }}</i>
                  <i class="subtitle ml3" style="font-style: normal;">{{
                      $t('lever.closeTime')
                    }}</i><i class="subtitle ml3" style="font-style: normal;">{{ item.complete_time.substring(5) }}</i>
                  </span>
                <span>
              </span>
              </div>
              <div class="flex mt5">
                <div class="tall" style="width: 33%">
                  <div class="subtitle">
                    {{ item.symbol }}
                  </div>
                  <div class="subb">
                    {{ item.origin_price|numberFixed(2) }}
                  </div>
                </div>
                <div class="talc" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.hands') }} * {{ $t('lever.timed') }}
                  </div>
                  <div class="subb">
                    {{ item.share }} * {{ item.multiple }}
                  </div>
                </div>
                <div class="talr" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.closePrice') }}
                  </div>
                  <div class="subb" :class="item.profits>0?'green':'red'">
                    {{ item.update_price|numberFixed(2) }}
                  </div>
                </div>

              </div>
              <div class="flex mt5">
                <div class="tall" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.bail') }}
                  </div>
                  <div class="subb">
                    {{ item.origin_caution_money|numberFixed(2) }}
                  </div>
                </div>
                <div class="talc" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.charge') }}
                  </div>
                  <div class="subb">
                    {{ item.trade_fee|numberFixed(2) }}
                  </div>
                </div>
                <div class="talr" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('td1.status') }}
                  </div>
                  <div class="subb">

                    {{ $t('lever.closed') }}
                  </div>
                </div>
              </div>
              <div class="flex mt5">
                <div class="tall" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.styPrice') }}
                  </div>
                  <div class="subb">
                    {{ item.target_profit_price|numberFixed(2) }}
                  </div>
                </div>
                <div class="talc" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.stsPrice') }}
                  </div>
                  <div class="subb">
                    {{ item.stop_loss_price|numberFixed(2) }}
                  </div>
                </div>

                <div class="talr" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.loss') }}
                  </div>
                  <div class="subb" :class="item.profits>0?'green':'red'">
                    {{ item.profits|numberFixed(2) }}
                  </div>
                </div>
              </div>
              <mu-divider></mu-divider>
            </div>
            <div class="mt20" v-if="list_content.length<=0">
              <svg color="gray" class="icon" font-size="40px" aria-hidden="true">
                <use xlink:href="#icon-empty1"></use>
              </svg>
              <p class="subtitle">{{ $t('tpc.nodata') }}</p>
            </div>
          </div>
          <div class="demo-text" v-if="loadType === 3">
            <div style="margin:10px 0;" v-for="item in list_content">
              <div class="flex alcenter">
                <span class="flex1" style="text-align: left">
                  <span class="bold" :class="item.type===1?'green':'red'"
                        style="font-size: 14px;">{{
                      item.type === 1 ? $t('lever.dmore') : $t('lever.dshort')
                    }}</span> <i
                    class="subtitle" style="font-style: normal;">{{ item.transaction_time.substring(5) }}</i>
                  <i class="subtitle ml3" style="font-style: normal;">{{
                      $t('lever.revokeTime')
                    }}</i><i class="subtitle ml3" style="font-style: normal;">{{ item.complete_time.substring(5) }}</i>
                  </span>
                <span>
              </span>
              </div>
              <div class="flex mt5">
                <div class="tall" style="width: 33%">
                  <div class="subtitle">
                    {{ item.symbol }}
                  </div>
                  <div class="subb">
                    {{ item.origin_price|numberFixed(2) }}
                  </div>
                </div>
                <div class="talc" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.hands') }} * {{ $t('lever.timed') }}
                  </div>
                  <div class="subb">
                    {{ item.share }} * {{ item.multiple }}
                  </div>
                </div>

                <div class="talr" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('td1.status') }}
                  </div>
                  <div class="subb red">

                    {{ $t('lever.revoked') }}
                  </div>
                </div>

              </div>
              <div class="flex mt5">
                <div class="tall" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.bail') }}
                  </div>
                  <div class="subb">
                    {{ item.origin_caution_money|numberFixed(2) }}
                  </div>
                </div>
                <div class="talc" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.charge') }}
                  </div>
                  <div class="subb">
                    {{ item.trade_fee|numberFixed(2) }}
                  </div>
                </div>
              </div>
              <mu-divider></mu-divider>
            </div>
            <div class="mt20" v-if="list_content.length<=0">
              <svg color="gray" class="icon" font-size="40px" aria-hidden="true">
                <use xlink:href="#icon-empty1"></use>
              </svg>
              <p class="subtitle">{{ $t('tpc.nodata') }}</p>
            </div>
          </div>
        </mu-container>

        <mu-container v-if="trade===2">
          <mu-tabs class="bold" :value.sync="active2" inverse color="primary" indicator-color="white" center>
            <mu-tab>{{ $t('miscro.trade') }}</mu-tab>
            <mu-tab>{{ $t('lever.closed') }}</mu-tab>
          </mu-tabs>
          <div class="demo-text" v-if="active2 === 0">
            <div style="margin:10px 0;" v-for="(item,index) in slist_content">
              <div class="flex alcenter">
                <span class="flex1" style="text-align: left">
                  <span class="bold" :class="item.type===1?'green':'red'"
                        style="font-size: 14px;">{{
                      item.type === 1 ? $t('miscro.up') : $t('miscro.down')
                    }}</span> <i
                    class="subtitle" style="font-style: normal;">{{ item.created_at.substring(5) }}</i>
                  </span>
                <span>
              </span>
              </div>
              <div class="flex mt5">
                <div class="tall" style="width: 33%">
                  <div class="subtitle">
                    {{ item.symbol_name }}
                  </div>
                  <div class="subb">
                    {{ item.open_price|numberFixed(2) }}
                  </div>
                </div>
                <div class="talc" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.hands') }}
                  </div>
                  <div class="subb">
                    {{ item.number }}
                  </div>
                </div>
                <div class="talr" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.nowPrice') }}
                  </div>
                  <div class="subb"
                       :class="(item.type===1?newData>item.open_price:newData<item.open_price)?'green':'red'">
                    {{ newData }}
                  </div>
                </div>

              </div>
              <div class="flex mt5">
                <div class="tall" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('c2c.timer') }}
                  </div>
                  <div class="subb">
                    {{ item.seconds }}<i class="currency_title">Sec</i>
                  </div>
                </div>

                <div class="talc" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.loss') }}[{{ item.currency_name }}]
                  </div>
                  <div class="subb" :class="item.fact_profits>0?'green':'red'">
                    {{ item.fact_profits|numberFixed(2) }}
                  </div>
                </div>

                <div class="talr" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('miscro.times') }}
                  </div>
                  <div class="subb">

                    {{ countDown(item.endTime, index, item.seconds) }}
                  </div>
                </div>
              </div>
              <mu-divider></mu-divider>
            </div>
            <div class="mt20" v-if="slist_content.length<=0">
              <svg color="gray" class="icon" font-size="40px" aria-hidden="true">
                <use xlink:href="#icon-empty1"></use>
              </svg>
              <p class="subtitle">{{ $t('tpc.nodata') }}</p>
            </div>
          </div>
          <div class="demo-text" v-if="active2 === 1">
            <div style="margin:10px 0;" v-for="item in slist_content">
              <div class="flex alcenter">
                <span class="flex1" style="text-align: left">
                  <span class="bold" :class="item.type===1?'green':'red'"
                        style="font-size: 14px;">{{
                      item.type === 1 ? $t('miscro.up') : $t('miscro.down')
                    }}</span> <i
                    class="subtitle" style="font-style: normal;">{{ item.created_at.substring(5) }}</i>
                  <i class="subtitle ml3" style="font-style: normal;">{{
                      $t('lever.closeTime')
                    }}</i><i class="subtitle ml3" style="font-style: normal;">{{ item.complete_at.substring(5) }}</i>
                  </span>
                <span>
              </span>
              </div>
              <div class="flex mt5">
                <div class="tall" style="width: 33%">
                  <div class="subtitle">
                    {{ item.symbol_name }}
                  </div>
                  <div class="subb">
                    {{ item.open_price|numberFixed(2) }}
                  </div>
                </div>
                <div class="talc" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.hands') }}
                  </div>
                  <div class="subb">
                    {{ item.number }}
                  </div>
                </div>
                <div class="talr" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.closePrice') }}
                  </div>
                  <div class="subb" :class="item.fact_profits>0?'green':'red'">
                    {{ item.end_price|numberFixed(2) }}
                  </div>
                </div>

              </div>
              <div class="flex mt5">
                <div class="tall" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('c2c.timer') }}
                  </div>
                  <div class="subb">
                    {{ item.seconds }}<i class="currency_title">Sec</i>
                  </div>
                </div>

                <div class="talc" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('lever.loss') }}[{{ item.currency_name }}]
                  </div>
                  <div class="subb" :class="item.fact_profits>0?'green':'red'">
                    {{ item.fact_profits|numberFixed(2) }}
                  </div>
                </div>

                <div class="talr" style="width: 33%">
                  <div class="subtitle">
                    {{ $t('td1.status') }}
                  </div>
                  <div class="subb">

                    {{ $t('lever.closed') }}
                  </div>
                </div>
              </div>
              <mu-divider></mu-divider>
            </div>
            <div class="mt20" v-if="slist_content.length<=0">
              <svg color="gray" class="icon" font-size="40px" aria-hidden="true">
                <use xlink:href="#icon-empty1"></use>
              </svg>
              <p class="subtitle">{{ $t('tpc.nodata') }}</p>
            </div>
          </div>
        </mu-container>

      </div>

    </div>

    <div class="footer">
      <Footer active="trade"></Footer>
    </div>
    <mu-dialog :title="$t('lay.confirm')" width="600" max-width="80%" :esc-press-close="false"
               :overlay-close="false" :open.sync="openAlert">
      <div v-if="trade===1">
        <div class="left flex alcenter" style="text-align: left; line-height: 20px;">
          <div class="subtitle nowrap" style="color:rgba(0,0,0,.54)">{{ $t('cuy.price') }}</div>
          <div class="flex1 talr nowrap currency_title">{{
              (Number(price).toFixed(2))
            }}<i class="currency_title">USDT</i>
          </div>
        </div>
        <div class="left flex alcenter" style="text-align: left; line-height: 20px;">
          <div class="subtitle nowrap" style="color:rgba(0,0,0,.54)">{{ $t('lever.contractVal') }}</div>
          <div class="flex1 talr nowrap currency_title">{{
              Number(tradeAmount).toFixed(2)
            }}<i class="currency_title">USDT</i>
          </div>
        </div>

        <div class="left flex alcenter" style="text-align: left; line-height: 20px;">
          <div class="subtitle nowrap" style="color:rgba(0,0,0,.54)">{{ $t('lever.bail') }}</div>
          <div class="flex1 talr nowrap currency_title">{{
              (Number(bons).toFixed(2))
            }}<i class="currency_title">USDT</i>
          </div>
        </div>
        <div class="left flex alcenter" style="text-align: left; line-height: 20px;">
          <div class="subtitle nowrap" style="color:rgba(0,0,0,.54)">{{ $t('lever.charge') }}</div>
          <div class="flex1 talr nowrap currency_title">{{
              (Number(fee).toFixed(2))
            }}<i class="currency_title">USDT</i>
          </div>
        </div>
      </div>
      <div v-if="trade===2">
        <div class="left flex alcenter" style="text-align: left; line-height: 20px;">
          <div class="subtitle nowrap" style="color:rgba(0,0,0,.54)">{{ $t('miscro.num') }}</div>
          <div class="flex1 talr nowrap currency_title">{{
              tsnumber
            }}<i class="currency_title">{{ secondModes[secondsMoneyMode].name }}</i>
          </div>
        </div>
        <div class="left flex alcenter" style="text-align: left; line-height: 20px;">
          <div class="subtitle nowrap" style="color:rgba(0,0,0,.54)">{{ $t('miscro.mode') }}</div>
          <div class="flex1 talr nowrap currency_title">{{
              secondTimes[tstime].seconds
            }}<i class="currency_title">Sec</i>
          </div>
        </div>
        <div class="left flex alcenter" style="text-align: left; line-height: 20px;">
          <div class="subtitle nowrap" style="color:rgba(0,0,0,.54)">{{ $t('miscro.rate') }}</div>
          <div class="flex1 talr nowrap currency_title">{{
              tsrate
            }}<i class="currency_title">%</i>
          </div>
        </div>
      </div>
      <mu-button slot="actions" flat color="primary" @click="openAlert=false">{{ $t('lay.ceil') }}</mu-button>
      <mu-button slot="actions" v-if="trade===1" flat :color="tradeMode === 'buy'?'green':'red'" @click="buyContract">{{
          tradeMode === 'buy' ? $t('lever.domore') : $t('lever.doshort')
        }}
      </mu-button>
      <mu-button slot="actions" v-if="trade===2" flat :color="tradeMode === 'buy'?'green':'red'" @click="buySecond">{{
          tradeMode === 'buy' ? $t('miscro.up') : $t('miscro.down')
        }}
      </mu-button>
    </mu-dialog>

    <mu-dialog title="Tips" width="600" max-width="80%" :esc-press-close="false"
               :overlay-close="false" :open.sync="openPing">
      {{ $t('lever.sureClose') }}
      <mu-button slot="actions" flat color="primary" @click="openPing=false">{{ $t('legal.ceil') }}</mu-button>
      <mu-button slot="actions" v-if="trade===1" flat color="primary" @click="pingcang(pingId)">{{
          $t('confirm')
        }}
      </mu-button>
    </mu-dialog>

    <mu-dialog title="Tips" width="600" max-width="80%" :esc-press-close="false"
               :overlay-close="false" :open.sync="openCancel">
      {{ $t('lever.revokeOrder') }}
      <mu-button slot="actions" flat color="primary" @click="openCancel=false">{{ $t('legal.ceil') }}</mu-button>
      <mu-button slot="actions" v-if="trade===1" flat color="primary" @click="cancel(cancelId)">{{
          $t('confirm')
        }}
      </mu-button>
    </mu-dialog>

    <mu-dialog :title="$t('lever.setloss')" width="600" max-width="80%" :esc-press-close="false"
               :overlay-close="false" :open.sync="openSet">
      <div>
        <mu-text-field style="margin-bottom: 20px!important;" center prepend append @change="changePro(1)"
                       :help-text=" $t('lever.expectProfit')+' '+winPriceY"
                       :label="$t('lever.styPrice')"
                       v-model="winPrice">
          <mu-icon @click="add(1)" style="margin-right: 5px;" value=":icon-plus-add" slot="prepend"></mu-icon>
          <mu-icon @click="reduce(1)" value=":icon-jian" slot="append"></mu-icon>
        </mu-text-field>
        <mu-text-field :help-text=" $t('lever.expectLoss')+' '+lossPriceY" center :label="$t('lever.stsPrice')"
                       v-model="lossPrice">
          <mu-icon @click="add(2)" style="margin-right: 5px;" value=":icon-plus-add" slot="prepend"></mu-icon>
          <mu-icon @click="reduce(2)" value=":icon-jian" slot="append"></mu-icon>
        </mu-text-field>
      </div>
      <mu-button slot="actions" flat color="primary" @click="openSet=false">{{ $t('legal.ceil') }}
      </mu-button>
      <mu-button slot="actions" v-if="trade===1" flat color="primary" @click="setLoss()">{{
          $t('confirm')
        }}
      </mu-button>
    </mu-dialog>

  </div>
</template>
<style lang="scss">

.inputshare {
  .mu-input {
    width: auto;
  }
}

.lever {
  .mu-input.has-label {
    padding-bottom: 12px;
  }
}
</style>

<script>

import Footer from "@/components/Footer";
import getUrlKey from "@/lib/getUrlKey";

export default {
  name: "Trade",
  data() {
    return {
      openAlert: false,
      openPing: false,
      openCancel: false,
      openSet: false,
      lossPrice: 0,
      setId: 0,
      winPrice: 0,
      winPriceY: 0,
      lossPriceY: 0,
      pingId: 0,
      cancelId: 0,
      trade: 1,
      docked: false,
      open: false,
      openTradeMode: false,
      position: 'left',
      quotationsList: [],
      options: [],
      tradeMode: 'buy',
      priceMode: 'shijia',
      sliderValue: 0,
      price: 0,
      number: 0,
      inMaxValue: 0,
      inList: [],
      sellMaxValue: 0,
      outList: [],
      newData: 0,
      active1: 0,
      active2: 0,
      currency_id: 0,
      currency_name: '',
      bestPrice: this.$t('lever.bestprice'),
      multi: [],
      shared: [],
      tmuti: '',
      tshared: '',
      user_lever: 0,
      fee: 0,
      bons: 0,
      tradeAmount: 0,
      shareNum: 0,
      loadType: 1,
      list_content: [],
      slist_content: [],
      secondModes: [],
      secondTimes: [],
      tstime: 0,
      tsrate: 0,
      secondsNumbers: [],
      tsnumber: '',
      secondsMoneyMode: 0,
      tswallet: false,
      match_id: '',
      CountDown: 0

    }
  },
  components: {
    Footer
  },
  watch: {
    priceMode(val) {
      this.price = this.newData;
    },
    tradeMode(val) {
      this.price = this.newData;
    },
    tmuti(val) {
      this.calcAmount();
    },
    tshared(val) {

      this.calcAmount();
    },
    price(val) {
      this.calcAmount();
    },
    loadType(val) {
      this.list_content = [];
      if (val > 1) {
        this.getListContent();
      }
    },
    active2(val) {
      this.slist_content = [];
      this.getSListContent();

    },
    secondsMoneyMode(val) {
      this.tsnumber = '';

      let arr = [];
      this.secondModes[val].micro_numbers.forEach(x => {
        arr.push(parseInt(x.number).toString());
      });
      this.secondsNumbers = arr;

      this.tswallet = this.secondModes[val].user_wallet;
      // this.secondsNumbers = this.secondModes[val].micro_numbers;
    },
    tstime(val) {
      this.tsrate = this.secondTimes[val].profit_ratio;
    },
    winPrice(val){
      this.add(1);
      this.reduce(1);
    },
    lossPrice(val){
      this.add(2);
      this.reduce(2);
    }
  },
  mounted() {

    if (this.from == 'lever') {
      this.buyText = this.$t('lever.domore');
      this.sellText = this.$t('lever.doshort');
    } else if (this.from == 'second') {
      this.buyText = this.$t('miscro.up');
      this.sellText = this.$t('miscro.down');
    }

    if (getUrlKey('mode', window.location.href)) {
      this.trade = parseInt(getUrlKey('mode', window.location.href));
    }

    if (getUrlKey('way', window.location.href) === 'out') {
      this.tradeMode = 'sell';
    } else {
      this.tradeMode = 'buy';
    }

    this.init();
    this.getSeconds();
    this.loadSeconds();
    this.getSListContent();
    let that = this;
    eventBus.$on('updateKLine', res => {

      that.newData = res.close;
    });
  },
  methods: {
    changePro(type) {

    },
    init() {
      if (!window.localStorage.getItem('currentCurrency')) {
        window.localStorage.setItem('currentCurrency', 'BTC');
        window.localStorage.setItem('currentCurrencyID', 1);
      }
      this.currency_name = window.localStorage.getItem("currentCurrency");
      this.currency_id = window.localStorage.getItem('currentCurrencyID');
      this.subScribeMarket();
      this.getSharedAndMulti();
      this.subscribeMicro();
      this.options = [{label: this.$t('center.shi'), value: 'shijia'}, {
        value: 'xianjia',
        label: this.$t('center.xian')
      }];
    },
    getDayColor(attr) {
      // let key = attr+"-color";
      // return {
      //   key:localStorage.getItem('mode') === 'day' ? '#eee' : '#000'
      // };
      let obj = {};
      obj[attr] = localStorage.getItem('mode') === 'day' ? '#eee' : '#39393a';
      return obj;
    },
    getSharedAndMulti() {
      let that = this;
      let url = '/api/lever/deal';
      this.$http({
        url: url,
        method: 'post',
        data: {
          currency_id: this.currency_id,
          legal_id: 3
        },
        headers: {Authorization: localStorage.getItem("token")}
      }).then(res => {
        if (res.data.type == 'ok') {
          that.multi = res.data.message.multiple.muit;
          that.tmuti = that.multi[0].value;
          that.shared = res.data.message.multiple.share;
          // that.tshared = that.shared[0].value;
          that.user_lever = res.data.message.user_lever;
        }
      })
    },
    subScribeMarket() {

      let that = this;


      this.$http({
        url: "/api/currency/quotation_new",
        method: "get",
        data: {}
      }).then(res => {
        if (res.data.type === "ok") {

          let arr = [];
          for (let i = 0; i < res.data.message.length; i++) {
            for (let j = 0; j < res.data.message[i].quotation.length; j++) {
              arr.push(res.data.message[i].quotation[j]);
              if (res.data.message[i].quotation[j].currency_name === that.currency_name) {
                that.currency_id = res.data.message[i].quotation[j].currency_id;
                that.match_id = res.data.message[i].quotation[j].id;
                that.shareNum = res.data.message[i].quotation[j].lever_share_num * res.data.message[i].quotation[j].now_price;
              }
            }
          }
          that.subScribeDepth();
          that.quotationsList = arr;

          that.sockets.subscribe('daymarket', msg => {
            if (msg.type == 'daymarket') {

              for (let i = 0; i < that.quotationsList.length; i++) {
                if (that.quotationsList[i].legal_id === msg.legal_id && that.quotationsList[i].currency_id === msg.currency_id) {
                  that.quotationsList[i].now_price = msg.now_price;
                  that.quotationsList[i].change = msg.change;
                  that.quotationsList[i].volume = msg.volume;
                  that.quotationsList[i].high = msg.high;
                  that.quotationsList[i].low = msg.low;
                }
              }
            }
          });

        }

      }).catch(error => {
      });

      this.$socket.emit("login", localStorage.getItem("user_id"));
      this.sockets.subscribe("lever_trade", msg => {

        if (msg.type == "lever_trade" && that.loadType == 1) {
          let datas = JSON.parse(msg.trades_all);
          // that.riskRate = msg.hazard_rate;
          // that.totalPro = msg.profits_all;
          // that.profitsPrice = msg.profits;
          let arr = [];
          datas.forEach(x => {
            if (3 == x.legal && that.currency_id == x.currency) {
              arr.push(x);
            }
          });
          // for (let i in datas) {
          //   // console.log(datas[i]);
          //   if (3 == i.legal && that.currency_id == i.currency) {
          //     arr.push(datas[i]);
          //   }
          // }
          that.list_content = datas;
        }
        if (msg.type == "lever_trade" && that.loadType === 0) {
          let datas = JSON.parse(msg.trades_entrust);
          // that.riskRate = msg.hazard_rate;
          // that.totalPro = msg.profits_all;
          // that.profitsPrice = msg.profits;
          let arr = [];
          datas.forEach(x => {
            if (3 == x.legal && that.currency_id == x.currency) {
              arr.push(x);
            }
          });

          that.list_content = arr;
        }
      });
    },
    subScribeDepth() {


      let that = this;
      that.sockets.subscribe("market_depth", msg => {
        if (msg.type == "market_depth") {

          // console.log(msg);
          let inData = msg.bids;
          let outData = msg.asks.reverse();
          if (msg.currency_id === that.currency_id && msg.legal_id === 3) {
            // console.log(msg);
            let [inlist, outList] = [inData, outData];
            let [max, max1] = [0, 0];
            for (let i in inData) {
              // console.log(that.inMaxValue, inData[i], '变更');

              inlist[i].price = inlist[i][0];
              inlist[i].number = inlist[i][1];
              max = inlist[i].number > max ? inlist[i].number : max;

            }

            that.inMaxValue = max;
            that.inList = inlist;

            for (let i in outList) {
              outList[i].price = outList[i][0];
              outList[i].number = outList[i][1];
              max1 = outList[i].number > max1 ? outList[i].number : max1;
              // that.sellMaxValue = outList[i].number;

            }


            if (that.price == 0) {
              that.price = that.newData;
            }

            that.sellMaxValue = max1;
            that.outList = outList;
          }
        }
      });

      that.sockets.subscribe("kline", msg => {
        let obj = {}
        if (that.currency_name + '/' + 'USDT' == msg.symbol) {

          obj.open = Number(msg.open)
          obj.low = Number(msg.low)
          obj.high = Number(msg.high)
          obj.close = Number(msg.close)
          obj.volume = Number(msg.volume)
          obj.time = Number(msg.time)
          obj.change = msg.change;
          obj.period = msg.period;
          if (msg.currency_name === window.localStorage.getItem("currentCurrency") && obj.period === '1min') {
            // console.log(msg.close)
            eventBus.$emit('updateKLine', obj);
          }

        }
      });

    },
    changeCurrency(currency_name, currency_id) {
      window.localStorage.setItem('currentCurrency', currency_name);
      window.localStorage.setItem('currentCurrencyID', currency_id);
      this.open = false;
      this.currency_name = currency_name;
      this.currency_id = currency_id;
      this.price = 0;
      // this.init();
    },
    calcAmount() {

      let that = this;

      that.tradeAmount = 0;
      that.fee = 0;
      that.bons = 0;
      if (this.price === '' || this.tshared === '' || this.tmuti === '') {
        return;
      }

      let bond = this.price;
      // 倍数
      let muitNum = this.tmuti;
      // 张数
      let share = this.tshared;

      let type = this.tradeMode;


      this.$http({
        url: "/api/currency/quotation_new",
        method: "get",
        data: {},
        headers: {Authorization: localStorage.getItem("token"), not_loading: true}
      }).then(res => {
        if (res.data.type === "ok") {
          let list = res.data.message[0].quotation;
          for (let i in list) {
            if (that.currency_id === list[i].currency_id) {
              let spread = list[i].spread;
              let transactionFee = list[i].lever_trade_fee;
              let prices = ((bond * 1) * spread) / 100;
              let pricesTotal = 0;
              if (type === "sell") {
                pricesTotal = (bond * 1) - (prices - 0);
              } else {
                pricesTotal = (bond * 1) + (prices - 0);
              }
              muitNum = parseFloat(muitNum).toFixed(4);
              share = parseFloat(share).toFixed(4);
              let shareNum = parseFloat(list[i].lever_share_num).toFixed(4);
              that.shareNum = bond * shareNum;
              let totalPrice = pricesTotal * share * shareNum;
              let bondsValue = (totalPrice - 0) / (muitNum - 0)
              let tradeFreeValue = (totalPrice * transactionFee) / 100;
              if (type === "buy") {
                that.tradeAmount = (bond * share * shareNum).toFixed(4);
                that.fee = tradeFreeValue;
                that.bons = bondsValue;
                console.log(that.tradeAmount, that.fee, that.bons);
              } else {
                that.tradeAmount = (bond * share * shareNum).toFixed(4);
                that.fee = tradeFreeValue;
                that.bons = bondsValue;
                console.log(that.tradeAmount, that.fee, that.bons);
              }
            }
          }
        }
      }).catch(error => {
        console.log(error);
      });
    },
    getListContent() {
      let that = this;
      this.$http({
        url: '/api/lever/my_trade',
        method: 'post',
        headers: {Authorization: localStorage.getItem("token")},
        data: {
          status: this.loadType + 1,
          legal_id: 3,
          currency_id: this.currency_id,
          page: 1,
          limit: 100
        }
      }).then(res => {
        if (res.data.type === 'ok') {
          that.list_content = res.data.message.message.data;
        }
      })
    },
    getSListContent() {
      let that = this;
      this.$http({
        url: '/api/microtrade/lists',
        method: 'get',
        headers: {Authorization: localStorage.getItem("token")},
        data: {
          status: 3,
          legal_id: 3,
          currency_id: this.currency_id,
          page: 1,
          match_id: this.match_id,
          limit: 100
        }
      }).then(res => {
        if (res.data.type === 'ok') {
          let arr = res.data.message.data.filter(x => {
            return x.status === (that.active2 === 0 ? 1 : 3);
          });
          let nowTime = new Date().getTime();

          arr.forEach(x => {
            x.endTime = nowTime - 0 + (x.remain_milli_seconds - 0);
          })
          that.slist_content = arr;
          that.Djs_time();
        }
      })
    },
    getSeconds() {
      let that = this;
      this.$http({
        url: '/api/microtrade/payable_currencies',
        method: 'get',
        headers: {Authorization: localStorage.getItem("token")},
      }).then(res => {
        if (res.data.type === 'ok') {
          that.secondModes = res.data.message;
          that.tswallet = that.secondModes[0].user_wallet;
          if (that.secondsNumbers.length === 0) {
            let arr = [];
            that.secondModes[0].micro_numbers.forEach(x => {
              arr.push(parseInt(x.number).toString());
            })
            that.secondsNumbers = arr;
          }
        }
      })
    },
    loadSeconds() {
      let that = this;
      this.$http({
        url: '/api/microtrade/seconds',
        method: 'get',
        headers: {Authorization: localStorage.getItem("token")},
      }).then(res => {
        if (res.data.type === 'ok') {

          let arr = []
          res.data.message.forEach(x => {
            if (x.status === 1)
              arr.push(x)
          });

          that.tsrate = arr[0].profit_ratio;

          that.secondTimes = arr;
          // console.log(that.secondTimes);

        }
      })
    },

    buyContract() {

      if(this.price<0.00000001)
      {

        this.$toast.warning(this.$t('lever.pprice'));
        return;
      }
      if(this.tshared<=0.00000001)
      {
        this.$toast.warning(this.$t('lever.phand'));
        return;
      }

      if(this.tmuti<=0.00000001)
      {
        this.$toast.warning(this.$t('lever.ptimes'));
        return;
      }

      let url = '/api/lever/submit';

      let that = this;

      this.$http({
        url: url,
        method: "post",
        data: {
          legal_id: 3,
          currency_id: this.currency_id,
          multiple: parseInt(this.tmuti),
          share: parseInt(this.tshared),
          type: this.tradeMode === 'buy' ? 1 : 2,
          status: this.priceMode === 'xianjia' ? 0 : 1,
          target_price: this.price
        },
        headers: {Authorization: localStorage.getItem("token")}
      }).then(res => {
        that.openAlert = false;

        // layer.msg(res.data.message)
        if (res.data.type === "ok") {
          that.price = 0;
          that.number = '';

          that.getListContent();
          eventBus.$emit("buyTrade", "tradebuy");
          eventBus.$emit("tocel", "updata");
          eventBus.$emit("to_leverExchange", "leverExchange");
          // that.buy_sell(that.legal_id,that.currency_id)
          that.$toast.success(res.data.message);

        } else {
          that.$toast.warning(res.data.message);
        }
      })
          .catch(error => {
            console.log(error);

            that.openAlert = false;
          });

    },

    buySecond() {

      if(this.tsnumber<0.00000001)
      {

        this.$toast.warning(this.$t('footer.openNum'));
        return;
      }

      let that = this;
      this.$http({
        url: "/api/microtrade/submit",
        method: "post",
        data: {
          match_id: that.match_id,
          currency_id: that.secondModes[that.secondsMoneyMode].id,
          type: that.tradeMode === 'buy' ? 1 : 2,
          seconds: that.secondTimes[that.tstime].seconds,
          number: that.tsnumber,
        },
        headers: {Authorization: window.localStorage.getItem('token')}
      }).then(res => {
        that.openAlert = false;
        // layer.msg(res.data.message);
        if (res.data.type == "ok") {
          that.$toast.success(that.$t("miscro.success"));
          that.getSeconds();
          that.getSListContent();
        } else {
          that.$toast.warning(res.data.message);
        }
      });
    },

    subscribeMicro() {
      let that = this;
      this.$socket.emit('login', localStorage.getItem('user_id'));
      this.sockets.subscribe("closed_microorder", msg => {
        if (msg.type == "closed_microorder") {
          var datas = msg.data;
          for (var i = 0; i < that.slist_content.length; i++) {
            if (that.slist_content[i].id == datas.id) {
              that.slist_content[i] = datas;
              setTimeout(function () {
                let arr = that.slist_content;
                arr.splice(i, 1);
                that.slist_content = arr;
              }, 500);

              return false;
            }
          }
        }
      });
    },

    countDown(val, indexs, seconds) {
      var that = this;
      var timeValue = "";
      var process = 100 / Number(seconds);
      var seconds = "";
      var endItem = val; //获取列表传的截止时间

      var nowItem = new Date().getTime(); //获取当前时间
      var timeSpace = endItem - this.CountDown; //截止时间减去当前时间
      if (timeSpace > 0) {
        seconds = that.$utils.filterDecimals(timeSpace / 1000, 1);
        return seconds;
      } else if (timeSpace <= 0) {
        // that.init();
        return 0.0;
      }
    },

    Djs_time: function () {
      setInterval(() => {
        var presentTime = new Date().getTime();
        this.CountDown = presentTime;
      }, 200);
    },

    pingcang(id) {
      let that = this;

      that.$http({
        url: "/api/" + "lever/close",
        method: "post",
        data: {
          id: id
        },
        headers: {Authorization: localStorage.getItem("token")}
      }).then(res => {
        if (res.data.type === "ok") {
          that.$toast.success(res.data.message);
          // location.reload();
          that.getListContent();
          that.openPing = false;
        } else {
          that.$toast.warning(res.data.message);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    cancel(id) {
      let that = this;

      that.$http({
        url: "/api/" + "lever/cancel",
        method: "post",
        data: {
          id: id
        },
        headers: {Authorization: localStorage.getItem("token")}
      }).then(res => {

        that.openCancel = false;
        if (res.data.type == "ok") {
          that.$toast.success(res.data.message);
          that.getListContent();
        } else {
          that.$toast.warning(res.data.message);
        }
      })
          .catch(error => {
          });
    },
    setLoss() {
      let that = this;
      this.$http({
        url: "/api/" + "lever/setstop",
        method: "post",
        data: {
          id: that.setId,
          target_profit_price: that.winPrice,
          stop_loss_price: that.lossPrice
        },
        headers: {Authorization: localStorage.getItem("token")}
      })
          .then(res => {
            if (res.data.type == "ok") {
              that.openSet = false;
              that.$toast.success(res.data.message);
              for (let i in that.list_content) {
                if (that.setId == that.list_content[i].id) {
                  that.list_content[i].target_profit_price = that.winPrice;
                  that.list_content[i].stop_loss_price = that.lossPrice;
                }
              }
            } else {
              that.openSet = false;
              that.$toast.warning(res.data.message);
            }
          })
          .catch(error => {
            console.log(error);
          });
    },
    // 加
    add(type) {
      let that = this;
      let my = that.list_content.filter(x => {
        return x.id === that.setId
      })[0];
      //
      // return;
      if (my.type === 1) {
        if (type == 1) {
          that.winPrice = (parseFloat(that.winPrice) + 0.01).toFixed(2);
          that.winPriceY = (
              (parseFloat(that.winPrice) - my.price - 0) *
              (my.share - 0)
          ).toFixed(2);
        } else {
          that.lossPrice = (parseFloat(that.lossPrice) + 0.01).toFixed(2);
          that.lossPriceY = (
              (my.price - that.lossPrice - 0) *
              (my.share - 0)
          ).toFixed(2);
        }
      } else {
        if (type == 1) {
          that.winPrice = (parseFloat(that.winPrice) + 0.01).toFixed(2);
          that.winPriceY = (
              (parseFloat(my.price - that.winPrice) - 0) *
              (that.share - 0)
          ).toFixed(2);
        } else {
          that.lossPrice = (parseFloat(that.lossPrice) + 0.01).toFixed(2);
          that.lossPriceY = (
              (parseFloat(that.lossPriceY - that.price) - 0) *
              (my.share - 0)
          ).toFixed(2);
        }
      }
    },
    // 减
    reduce(type) {
      let that = this;
      let my = that.list_content.filter(x => {
        return x.id === that.setId
      })[0];

      if (my.type === 1) {
        if (type == 1) {
          if (that.winPrice > 0) {
            that.winPrice = (parseFloat(that.winPrice) - 0.01).toFixed(
                2
            );
            that.winPriceY = (
                (parseFloat(that.winPrice) - my.price - 0) *
                (my.share - 0)
            ).toFixed(2);
          } else {
            that.$toast.warning(that.$t('lever.thanzone'));
          }
        } else {
          if (that.lossPrice > 0) {
            that.lossPrice = (parseFloat(that.lossPrice) - 0.01).toFixed(2);
            that.lossPriceY = (
                (my.price - that.lossPrice - 0) *
                (my.share - 0)
            ).toFixed(2);
          } else {
            that.$toast.warning(that.$t('lever.thanzone'));
          }
        }
      } else {
        if (type == 1) {
          if (that.winPrice > 0) {
            that.winPrice = (parseFloat(that.winPrice) - 0.01).toFixed(
                2
            );
            that.winPriceY = (
                (my.price - that.winPrice - 0) *
                (my.share - 0)
            ).toFixed(2);
          } else {
            that.$toast.warning(that.$t('lever.thanzone'));
          }
        } else {
          if (that.lossPrice > 0) {
            that.lossPrice = (parseFloat(that.lossPrice) - 0.01).toFixed(2);
            that.lossPriceY = (
                (parseFloat(that.lossPriceY - my.price) - 0) *
                (that.share - 0)
            ).toFixed(2);
          } else {
            that.$toast.warning(that.$t('lever.thanzone'));
          }
        }
      }
    },
  },
}
</script>


<style lang="scss">
.button-wrapper {
  text-align: center;

  .mu-button {
    margin: 8px;
    vertical-align: top;
  }
}

.mu-flat-button .mu-button-wrapper {
  padding: 0 !important;
}

.subtitle {
  font-size: 12px;
  color: #888999;
}

.subb {
  font-size: 14px;
  line-height: 30px;
}

.tall {
  text-align: left;
}

.talr {
  text-align: right;
}

.talc {
  text-align: center;
}

.mu-raised-button {
  box-shadow: none !important;
}

.mu-item-action {
  min-width: 36px !important;
}

.mu-input {
  margin-bottom: 0 !important;
}
</style>
<style lang="scss">
.flex-demo {
  width: 33%;
}

.list-item {
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 12px;

  li {
    margin: 0;
    padding: 0;
    list-style: none;
    flex: 1;
    display: flex;
    flex-direction: row;
    position: relative;
    align-items: center;

    span:first-child {
      width: 50%;
    }

    span:nth-child(2) {
      width: 50%;
    }

    .info-shadow {
      height: 100%;
      background: rgba(53, 182, 90, .3);
      position: absolute;
      top: 0;
      right: 0;
      z-index: 0;
      transition: 0.2s;
      min-width: 10%;
    }

    .info-shadow.selli {
      height: 100%;
      background: rgba(255, 73, 74, .3);
      position: absolute;
      top: 0;
      right: 0;
      z-index: 0;
    }
  }
}
</style>