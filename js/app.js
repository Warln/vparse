//layui.use('form')

const vurls = [
  {
    name: '腾讯视频',
    value: 'http://v.qq.com/x/cover/945g2u0ctnfx7u4.html'
  },
  {
    name: '优酷视频',
    value: 'http://v.youku.com/v_show/id_XNDc0MTI0NTgw.html'
  },
  {
    name: '爱奇艺',
    value: 'http://www.iqiyi.com/v_19rrhoa87s.html'
  },
  {
    name: '乐视网',
    value: 'http://www.le.com/ptv/vplay/25663499.html'
  },
  {
    name: '搜狐视频',
    value: 'https://film.sohu.com/album/9175225.html'
  },
  {
    name: '土豆视频',
    value: 'http://video.tudou.com/v/XNDc0MTI0NTgw.html'
  },
  {
    name: '芒果TV',
    value: 'http://www.mgtv.com/b/9264/328195.html'
  },
]

const vroutes = [
  {
    group: "Dgua",
    routes: [
      {
        label: '【推荐使用】VIP万能解析接口',
        value: 'http://www.dgua.xyz/webcloud/?url='
      },
      {
        label: '【推荐使用】备用万能解析接口',
        value: 'http://www.dgua.xyz/webcloud/p2/?url='
      },
      {
        label: '乐视MMSID专用解析接口',
        value: 'http://dgua.xyz/webcloud/lesid/?url='
      },
      {
        label: 'm1905专用解析接口',
        value: 'http://www.dgua.xyz/webcloud/m1905/?url='
      },
      {
        label: '韩国daum专用高清接口',
        value: 'http://www.dgua.xyz/webcloud/daum/?url='
      },
      {
        label: 'kkyun专用解析接口',
        value: 'http://www.dgua.xyz/webcloud/kkyun/?url='
      },
      {
        label: 'm3u8专用解析接口',
        value: 'http://www.dgua.xyz/webcloud/m3u8/?url='
      },
      {
        label: 'MP4直链专用解析接口',
        value: 'http://www.dgua.xyz/webcloud/zhilian/?url='
      }
    ]
  },
  {
    group: '72du',
    routes: [
      {
        label: '通用vip引擎系统',
        value: 'http://v.72du.com/api/?url='
      },
      {
        label: '备用vip引擎系统',
        value: 'http://2.jx.72du.com/video.php?url='
      }
    ]
  },
  {
    group: 'VipJiexi',
    routes: [
      {
        label: '',
        value: 'http://www.vipjiexi.com/tong.php?url='
      },
      {
        label: '',
        value: 'http://www.vipjiexi.com/yun.php?url='
      }
    ]
  },
  {
    group: '47ks',
    routes: [
      {
        label: '',
        value: 'https://api.47ks.com/webcloud/?v='
      },
      {
        label: '',
        value: 'http://p2.api.47ks.com/webcloud/?v='
      }
    ]
  },
  {
    group: 'Jiexi',
    routes: [
      {
        label: '',
        value: 'http://www.jiexi.cx/5qiyi/ykyun.php?Url='
      },
      {
        label: '',
        value: 'http://www.jiexi.cx/5qiyi/5qiyi2.php?url='
      }
    ]
  },
  {
    group: '其他',
    routes: [
      {
        label: '壹号vip引擎系统【优酷超清】',
        value: 'http://v.rpsofts.com/i.php?url='
      },
      {
        label: '贰号vip引擎系统【优酷超清】',
        value: 'http://v.rpsofts.com/v.php?url='
      },
      {
        label: '伍号vip引擎系统【万能解析4】',
        value: 'http://www.chepeijian.cn/jiexi/vip.php?url='
      },
      {
        label: '陆号vip引擎系统【万能解析5】',
        value: 'http://000o.cc/jx/ty.php?url='
      },
      {
        label: '',
        value: 'http://api.nepian.com/ckparse/?url='
      },
      {
        label: '',
        value: 'http://aikan-tv.com/?url='
      },
      {
        label: '',
        value: 'http://api.heyaaa.com/?v='
      },
      {
        label: '',
        value: 'https://api.flvsp.com/?url='
      },
      {
        label: '',
        value: 'http://api.wlzhan.com/sudu/?url='
      },
      {
        label: '',
        value: 'http://yun.mt2t.com/yun?url='
      },
      {
        label: '',
        value: 'http://www.administrator5.com/admin.php?url='
      },
      {
        label: '',
        value: 'http://j.zz22x.com/jx/?url='
      },
      {
        label: '',
        value: 'https://www.yymeier.com/api.php?url='
      }
    ]
  },
  {
    group: '磁力链接',
    routes: [
      {
        label: 'Apiv.ga',
        value: 'http://apiv.ga/magnet/',
        match: 'magnet'
      }
    ]
  }
]

new Vue({
  el: '#app',
  data: {
    vurl: 'http://v.youku.com/v_show/id_XNDc0MTI0NTgw.html',
    vroute: 'http://api.nepian.com/ckparse/?url=',
    vurls,
    vroutes,
    vdurl: '',
    vrtK: 0
  },
  computed: {
    vpurl() {
      return this.vroute + this.vurl
    }
  },
  methods: {
    vplay() {
      this.vpurl = this.vroute + this.vurl
    },
    rtnext() {}
  },
  created() {
    layui.use('form', function () {
      const form = layui.form()
      form.on('select(vroute)', function (data) {
        this.vroute = data.value
        console.log(this.vroute)
        console.log(this.vurl)
        console.log(this.vpurl)
      })
    })
  }
});
