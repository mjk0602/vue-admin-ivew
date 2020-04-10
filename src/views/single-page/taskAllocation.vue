<template>
  <div>
    <Row>
      <Form inline label-position="right" :label-width="100" :model="formInline">
        <Row>
          <i-col>
            <FormItem label="客户账号">
              <Input v-model="formInline.AccountNumber" style="width: 211px"></Input>
            </FormItem>
            <FormItem label="始发公司">
              <Select
                style="width: 211px"
                v-model="formInline.SendsCompany"
                :transfer="true"
                filterable
                clearable
                @on-open-change="getSendsCompany"
              >
                <Option
                  v-for="(item, index) in companyList"
                  :value="item.SendsCompany"
                  :key="index"
                >{{ item.SendsCompany }}</Option>
              </Select>
            </FormItem>
            <Button type="primary" @click="getData()">搜索</Button>
            <!--  右侧筛选   isShowInDrawer代表 右侧展示需要判断的属性    hide 表示默认表格隐藏的属性   -->
           
              <span  @click="development">
                更多操作<i style :class="sanja ? 'sanjiao' : 'sanjiao2'"></i>
              </span>
           <div style="float:right">
                    <FormItem>
              <Button @click="value1 = true" type="primary">筛选</Button>
              <Drawer :closable="false" v-model="value1">
                <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                  <Checkbox :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
                </div>
                <CheckboxGroup
                  v-for="(item,index) in rightColumns"
                  v-model="checkAllGroup"
                  @on-change="checkAllGroupChange"
                >
                  <Checkbox :label="item.title">{{item.title}}</Checkbox>
                </CheckboxGroup>
              </Drawer>
            </FormItem>
            <!--右侧筛选 isShowInDrawer代表 右侧展示需要判断的属性    hide 表示默认表格隐藏的属性   -->

            <Button type="success" style="margin:0 10px">导出</Button>

            <Button type="error">重置</Button>
           </div>
     
          </i-col>
          <div :class="isMeng ? 'isA' : 'isb'">
            <i-col>
              <FormItem label="下单时间">
                <DatePicker
                  :value="formInline.xdtime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetimerange"
                  placement="bottom-start"
                  @on-change="handleChangexdtime"
                ></DatePicker>
              </FormItem>
              <FormItem label="要求取件时间">
                <DatePicker
                  :value="formInline.TakeTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetimerange"
                  placement="bottom-start"
                  @on-change="handleChangeTakeTime"
                ></DatePicker>
              </FormItem>
              <FormItem label="冷藏专车">
                <Select
                  style="width: 211px"
                  v-model="formInline.IsLook"
                  :transfer="true"
                  filterable
                >
                  <Option key="1" label="是" value="1"></Option>
                  <Option key="0" label="否" value="0"></Option>
                </Select>
              </FormItem>
              <FormItem label="是否安排">
                <Select v-model="formInline.Issuing" :transfer="true" filterable>
                  <Option key="1" label="是" value="1"></Option>
                  <Option key="0" label="否" value="0"></Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col>
              <FormItem label="收件省份">
                <Select
                  style="width: 211px"
                  v-model="formInline.GetDepart"
                  :transfer="true"
                  filterable
                  clearable
                  @on-open-change="GetDepartData"
                >
                  <Option
                    v-for="(item, index) in departList"
                    :value="item.GetDepart"
                    :key="item.index"
                  >{{ item.GetDepart }}</Option>
                </Select>
              </FormItem>

              <FormItem label="收件城市">
                <Select
                  style="width: 211px"
                  v-model="formInline.GetCity"
                  :transfer="true"
                  clearable
                  filterable
                  @on-open-change="GetCityData"
                >
                  <Option
                    v-for="(item, index) in cityList"
                    :value="item.GetCity"
                    :key="index"
                  >{{ item.GetCity }}</Option>
                </Select>
              </FormItem>
              <FormItem label="订单号">
                <Input v-model="formInline.OrderId" style="width: 211px"></Input>
              </FormItem>
            </i-col>
          </div>
        </Row>
      </Form>
    </Row>
    <Card>
      <Form inline :label-width="100">
        <Row type="flex" justify="space-between">
          <i-col :span="8">
            <Button type="primary" icon="ios-add">取件司机</Button>
          </i-col>
          <i-col :span="4">
            <FormItem label="总件数">287</FormItem>
            <FormItem label="总票数">52</FormItem>
          </i-col>
        </Row>
      </Form>

      <Table size="small" border :loading="loading" stripe :columns="columns" :data="tableData">
        <template slot-scope="{ row, index }" slot="Manager">
          <Poptip transfer trigger="hover">
            <span slot="content">{{row.Telephone}}</span>
            <span style="text-decoration: underline">{{row.Manager}}</span>
          </Poptip>
        </template>
        <template slot-scope="{ row, index }" slot="AccountNumber">
          <Poptip transfer trigger="hover" :title="row.AccountNumber">
            <span slot="content">
              销售人员:{{row.SaleName0}}
              <br />
              项目客服:{{row.ItemName}}
              <br />
            </span>
            <span style="text-decoration: underline">{{row.AccountNumber}}</span>
          </Poptip>
        </template>
        <template slot-scope="{ row, index }" slot="TakesCode">
          <Poptip transfer trigger="hover" :title="row.TakesCode">
            <span slot="content">
              工号:{{row.TakesName}}
              <br />
              联系方式:{{row.TakesTelephone}}
              <br />
            </span>
            <span style="text-decoration: underline">{{row.TakesCode}}</span>
          </Poptip>
        </template>
        <template slot-scope="{ row, index }" slot="WDQJ">
          <span
            @click="MultipleTemperature(row)"
            v-if="row.WDQJ=='多种温区'"
            style="text-decoration: underline;color:#2d8cf0"
          >{{row.WDQJ}}</span>
          <span v-else>{{row.WDQJ}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="BaoCai">
          <span
            @click="MultipleBox(row)"
            v-if="row.BaoCai=='多种箱型'"
            style="text-decoration: underline;color:#2d8cf0"
          >{{row.BaoCai}}</span>
          <span v-else>{{row.BaoCai}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">订单回复</Button>
        </template>
      </Table>
      <Page
        :total="total"
        show-sizer
        :page-size="limit"
        show-total
        :current="page"
        show-elevator
        @on-change="handleChangePage"
        @on-page-size-change="handlePageSizeChange"
        style="margin: 20px 0 0"
      ></Page>
    </Card>
    <!-- MultipleTemperatureMthosDialog -->
    <Modal
      v-model="MultipleTemperatureMthosDialog"
      title="温度计编码"
      :loading="loading"
      :footer-hide="true"
    >
      <div style="display: flex;flex-wrap: wrap">
        <Button
          v-for="(item,index) in wdqjContent"
          :key="index"
          style="padding: 5px 5px;margin:0 10px 10px 0"
          :prop="item.WDQJ"
          :label="item.WDQJ"
          type="info"
          disabled
        >{{item.WDQJ}}</Button>
      </div>
    </Modal>
    <!-- MultipleTemperatureMthosDialog -->
    <!-- MultipleBoxDialog -->

    <Modal v-model="MultipleBoxDialogMthos" title="多种箱型" :loading="loading" :footer-hide="true">
      <table class="mailTable" style="width: 100%;" >
        <tr v-for="(index,item) in Boxcontent">
          <td>{{item}}</td>
          <template v-for="(index2,item2) in Boxcontent[item]">
            <td>{{index2.PackageName}}*{{index2.Jian}}</td>
          </template>
        </tr>
      </table>
    </Modal>
    <!-- MultipleBoxDialog -->
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { getDate } from "@/libs/tools";

//所有的方法
import {
  getData,
  getlinkage,
  MultipleTemperatureMthos,
  MultipleBoxMthos
} from "@/api/taskAllocation";
export default {
  data() {
    return {
      MultipleTemperatureMthosDialog: false,
      MultipleBoxDialogMthos: false,
      wdqjContent: [],
      Boxcontent: [],
      formInline: {},
      value1: false,
      checkAll: false,
      loading: true,
      sanja: false,
      isMeng: false,
      checkAllGroup: [],

      checkAll: false,
      tableData: [],
      columns: [], // 表格展示的字段
      rightColumns: [], // 抽屉里所有的字段
      allColumns: [
        // 所有表头字段
        {
          type: "selection",
          width: 60,
          fixed: "left"
        },
        {
          title: "公司名称",
          key: "Company",
          width: 200,
          align: "center"
        },
        {
          title: "发件地址详情",
          key: "Address",
          width: 200,
          align: "center",
          hide: true,
          isShowInDrawer: true
        },
        {
          title: "联系人",
          key: "Manager",
          width: 100,
          slot: "Manager",
          align: "center"
        },
        {
          title: "温度区间",
          key: "WDQJ",
          slot: "WDQJ",
          width: 100,
          align: "center"
        },
        {
          title: "件数",
          key: "Jian",

          width: 80,
          align: "center"
        },
        {
          title: "货物名称",

          key: "CargoName",
          width: 100,
          align: "center"
        },
        {
          title: "温度计",
          key: "IsWdj",
          width: 100,
          align: "center"
        },
        {
          title: "箱型件数",
          key: "BaoCai",
          width: 100,
          align: "center",
          slot: "BaoCai"
        },
        {
          title: "客户账号",
          key: "AccountNumber",
          width: 100,
          slot: "AccountNumber",
          align: "center"
        },
        {
          title: "订单号",
          key: "id",
          width: 100,
          hide: true,

          align: "center",
          isShowInDrawer: true
        },
        {
          title: "科室",
          key: "",
          width: 100,
          hide: true,
          align: "center",
          isShowInDrawer: true
        },
        {
          title: "客户类型",
          key: "CompanyType",
          width: 100,
          hide: true,
          isShowInDrawer: true,
          align: "center"
        },
        {
          title: "项目号",
          key: "XMNO",
          width: 100,
          hide: true,
          isShowInDrawer: true,
          align: "center"
        },
        {
          title: "客户卡号",
          key: "KHCode",
          width: 200,
          hide: true,
          isShowInDrawer: true,
          align: "center"
        },
        {
          title: "客户单号",
          key: "KHNO",
          width: 100,
          hide: true,
          isShowInDrawer: true,
          align: "center"
        },
        {
          title: "协议号",
          key: "XYNO",
          width: 100,
          hide: true,
          isShowInDrawer: true,
          align: "center"
        },
        {
          title: "中心号",
          key: "",
          width: 100,
          hide: true,
          isShowInDrawer: true,
          align: "center"
        },
        {
          title: "收件编码",
          key: "",
          width: 100,
          hide: true,
          isShowInDrawer: true,
          align: "center"
        },
        {
          title: "录入人",
          key: "entryname",
          width: 100,
          hide: true,
          isShowInDrawer: true,
          align: "center"
        },
        {
          title: "时效",
          key: "LimitTime",
          width: 100,
          align: "center"
        },
        {
          title: "下单时间",
          key: "Indate",
          width: 200,
          align: "center"
        },
        {
          title: "要求取件时间",
          key: "OrderTime",
          width: 200,
          align: "center"
        },
        {
          title: "收件省份",
          key: "GetDepart",
          width: 100,
          hide: true,
          isShowInDrawer: true,
          align: "center"
        },
        {
          title: "收件城市",
          key: "GetCity",
          width: 100,
          align: "center"
        },
        {
          title: "收件公司",
          key: "GetCompany",
          width: 300,
          hide: true,
          isShowInDrawer: true,
          align: "center"
        },
        {
          title: "收件人",
          key: "GetName",
          width: 100,
          hide: true,
          isShowInDrawer: true,
          align: "center"
        },
        {
          title: "收件人联系方式",
          key: "GetTelephone",
          width: 300,
          hide: true,
          isShowInDrawer: true,
          align: "center"
        },
        {
          title: "收件地址",
          key: "GetAddress",
          width: 300,
          hide: true,
          isShowInDrawer: true,
          align: "center"
        },
        {
          title: "备注",
          key: "note1",
          width: 300,
          align: "center"
        },
        {
          title: "结算方式",
          key: "PayWay",
          width: 100,
          align: "center"
        },
        {
          title: "付款情况",
          key: "",
          width: 100,
          hide: true,
          isShowInDrawer: true,
          align: "center"
        },
        {
          title: "投保情况",
          key: "SafeItem",
          width: 100,
          align: "center"
        },
        {
          title: "取件人",
          key: "TakesCode",
          width: 100,
          hide: true,
          slot: "TakesCode",
          isShowInDrawer: true,
          align: "center"
        },
        {
          title: "通知方式",
          key: "",
          width: 100,
          hide: true,
          isShowInDrawer: true,
          align: "center"
        },
        {
          title: "处理时间",
          key: "Attention",
          width: 300,
          hide: true,
          isShowInDrawer: true,
          align: "center"
        },
        {
          title: "操作",
          slot: "action",
          width: 150,
          fixed: "right",
          align: "center"
        }
      ],
      companyList: [],
      cityList: [],
      departList: [],
      total: 0, //总条数
      page: 1, //当前页
      limit: 20 //每页条数
    };
  },
  methods: {
    //每行多种温区弹框
    MultipleTemperature(row) {
      const OrderId = row.id;
      this.MultipleTemperatureMthos(OrderId);
      this.MultipleTemperatureMthosDialog = true;
    },
    //每行多种箱型弹框
    MultipleBox(row) {
      const OrderId = row.id;
      this.MultipleBoxMthos(OrderId);
      this.MultipleBoxDialogMthos = true;
    },
    //获取表格数据
    async getData(page) {
      const params = this.beforeSubmit();
      if (page) {
        Object.assign(params, page);
      }
      const res = await getData(params);
      if (res.data.code == 200) {
        this.loading = false;

        const dataArr = res.data.data.result;
        this.tableData = dataArr;
        //给指定单元格自定义样式  循环加自定义属性。
        dataArr.forEach(item => {
          if (item.SafeItem === "投保") {
            item.cellClassName = {
              SafeItem: "demo-table-info-cell-name"
            };
          }
        });
        this.total = res.data.data.Count;
      } else {
        this.loading = false;

        this.tableData = [];
        this.total = 0;
      }
    },
    //每行多种温区弹框的方法
    async MultipleTemperatureMthos(OrderId) {
      const params = {
        OrderId: OrderId
      };
      const res = await MultipleTemperatureMthos(params);
      this.wdqjContent = res.data.data;
    },
    //每行多种箱型弹框的方法
    async MultipleBoxMthos(OrderId) {
      const params = {
        OrderId: OrderId
      };
      const res = await MultipleBoxMthos(params);
      this.Boxcontent = res.data.data;
    },

    //每页改变的时候 123
    handleChangePage(val) {
      this.loading = true;
      this.page = val;
      this.getData({ page: this.page, limit: this.limit });
    },
    //每页多少条改变的时候 10 20 30
    handlePageSizeChange(val) {
      this.loading = true;
      this.limit = val;
      this.getData({ page: this.page, limit: this.limit });
    },
    //获取下单时间
    handleChangexdtime(data) {
      this.formInline.xdtime = data;
    },
    handleChangeTakeTime(data) {
      this.formInline.TakeTime = data;
    },
    //全选事件
    handleCheckAll() {
      this.checkAll = !this.checkAll;
      if (this.checkAll) {
        //获取选中项的title  放进一个数组里RightTitle
        const RightTitle = [];
        // 改变选中状态
        this.rightColumns.forEach(item => {
          RightTitle.push(item.title);
        });
        this.checkAllGroup = RightTitle;
        // 改变表头字段，增加
        this.handleCheckedInTable(this.checkAllGroup);
      } else {
        this.checkAllGroup = [];
        this.allColumns.forEach(item => {
          if (item.isShowInDrawer) {
            item.hide = true;
          }
        });
        this.initTableHeader();
      }
    },
    //初始化右边抽屉
    initRightDrawer() {
      const arr = [];
      this.allColumns.forEach(item => {
        if (item.isShowInDrawer) {
          arr.push(item);
        }
      });
      this.rightColumns = arr;
    },

    //选中的状态改变的时候的事件
    checkAllGroupChange(data) {
      console.log(data, 8);
      this.handleCheckedInTable(data);
    },
    // 全选后改变表头字段，将全选后的所有项放到表头里
    handleCheckedInTable(data) {
      const arr = [...this.allColumns];
      // 遍历选中项，如果选中了，就把这一项的hide改成false
      data.forEach(item => {
        arr.forEach(sItem => {
          if (sItem.title === item) {
            sItem.hide = false;
          }
        });
      });
      this.columns = arr;
    },
    //三角符号
    development() {
      this.isMeng = !this.isMeng; //展示展开的数据
      this.sanja = !this.sanja; //三角符号的展示
    },
    //获取公司
    getSendsCompany(e) {
      if (e) {
        this.companyList = [];
        this.getlinkage("SendsCompany");
      }
    },
    //获取省份
    GetDepartData(e) {
      if (e) {
        this.departList = [];
        this.getlinkage("GetDepart");
      }
    },
    //获取城市
    GetCityData(e) {
      if (e) {
        this.cityList = [];
        this.getlinkage("GetCity");
      }
    },
    //默认获取省市区联动
    async getlinkage(Type) {
      const params = this.beforeSubmit();
      if (this.formInline.GetDepart) {
        Object.assign(params, { GetDepart: this.formInline.GetDepart });
      }
      if (this.formInline.GetCity) {
        Object.assign(params, { GetCity: this.formInline.GetCity });
      }
      if (this.formInline.SendsCompany) {
        Object.assign(params, { SendsCompany: this.formInline.SendsCompany });
      }
      Object.assign(params, { Type });
      const res = await getlinkage(params);
      console.log(res);
      if (Type === "SendsCompany") {
        this.companyList = res.data.data;
      } else if (Type === "GetDepart") {
        this.departList = res.data.data;
      } else if (Type === "GetCity") {
        this.cityList = res.data.data;
      }
    },

    //初始化提交的数据
    beforeSubmit() {
      const params = {
        Company: this.userInfo.Company,
        Depart: this.userInfo.Depart
      };
      const obj = JSON.parse(JSON.stringify(this.formInline));

      // obj.BeginTime = obj.xdtime[0];
      // obj.EndTime = obj.xdtime[1];
      // delete obj.xdtime;
      obj.OrderBeginTime = obj.TakeTime[0];
      obj.OrderEndTime = obj.TakeTime[1];
      delete obj.TakeTime;
      Object.assign(params, obj);
      return params;
    },
    // 初始化表头 hide=ture的从columns里删除,表格里展示的是columns里的数据
    // 根据所有表头信息初始化表格的表头，
    initTableHeader() {
      const arr = [];
      this.allColumns.forEach((item, index) => {
        if (!item.hide) {
          arr.push(item);
        }
      });
      this.columns = arr;
    },
    //初始化搜索的默认值
    initSearchData() {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const dateTime =
        new Date(currentYear, currentMonth, "01", "0", "0", "0").getTime() /
        1000;
      const time1 = getDate(dateTime, "year");
      const time2 = getDate(new Date().getTime() / 1000, "year");

      //this.formInline.xdtime = [time1, time2];
      this.formInline.TakeTime = [time1, time2];
    }
  },
  created() {
    this.initTableHeader();
    this.initRightDrawer();
    this.initSearchData();
  },
  mounted() {
    // 写个方法获取那个列表，在这调用 初始化
    this.userInfo = JSON.parse(Cookies.get("userInfo"));
    this.getData();
    this.getSendsCompany();
    this.GetDepartData();
    this.GetCityData();
  }
};
</script>

<style scoped>
.sanjiao {
  width: 0;
  border-width: 7px;
  border-style: solid;
  border-color: #666 transparent transparent transparent;
  top: 13px;
  position: relative;
}

.sanjiao2 {
  width: 0;
  border-width: 7px;
  border-style: solid;
  border-color: transparent transparent #666 transparent;

  position: relative;
  top: -10px;
}
.isA {
  display: block;
}

.isb {
  display: none;
}
</style>
<style>
.ivu-table .demo-table-info-cell-name {
  color: #2d8cf0;
}
  .mailTable,
    .mailTable tr td {
        border: 1px solid #e6eaee;
        border-collapse: collapse;
        padding: 5px;
    }
</style>