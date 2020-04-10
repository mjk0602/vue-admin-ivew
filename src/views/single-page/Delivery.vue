<template>
  <div>
    <Row>
      <i-col>
        <Form inline :label-width="80" :model="formInline">
          <FormItem label="车牌号码">
            <!-- 不要带括号，有参数再写括号  把表单里所有的model统一管理，用一个对象 还有  prop是做表单验证的，就是前边带个小红星必填啥的-->
            <Select v-model="formInline.carNumbers" :transfer="true" filterable>
              <Option v-for="(item,index) in CarNumberData" :value="item" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem label="司机姓名">
            <Select v-model="formInline.driverName" :transfer="true" filterable>
              <Option
                v-for="(item,index) in driverNameData"
                :value="item.TrueName"
                :key="index"
              >{{ item.TrueName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="运单号">
            <Input v-model="formInline.BillNumber"></Input>
          </FormItem>

          <Button type="primary" @click="getData">搜索</Button>

          <Button type="success" style="margin:0 10px" @click="exportTable">导出</Button>

          <Button type="error" @click="refresh">重置</Button>
        </Form>
      </i-col>
    </Row>

    <Card>
      <Row>
        <i-col :span="24">
          <div>
            <Form inline>
              <FormItem>
                <Button type="primary" icon="ios-add" @click="signin">派送</Button>
              </FormItem>
              <FormItem label="是否分配" :label-width="80">
                <RadioGroup v-model="isfenpei" @on-change="getData">
                  <Radio label="1">是</Radio>
                  <Radio label="0">否</Radio>
                </RadioGroup>
              </FormItem>
            </Form>
          </div>

          <Table
            size="small"
            border
            @on-selection-change="handleSelectTableItem"
            :loading="loading"
            stripe
            :columns="columns"
            :data="tableData"
            height="600"
          ></Table>
        </i-col>
      </Row>
    </Card>
  </div>
</template>

<script>
import Cookies from "js-cookie";
//所有的方法
import { getSelectList, getdriverName, getData, getAdd } from "@/api/data";

export default {
  data() {
    return {
      formInline: {
        carNumbers: "",
        driverName: "",
        BillNumber: ""
      },
      isfenpei: "0", //是否分配
      userInfo: null, //登录成功拿到的数据对象
      driverNameData: [], //司机姓名数组
      CarNumberData: [], //车牌号
      tableData: [], //表格数据
      loading: true,
      order_id: [],
      selection: [],
      columns: [
        {
          type: "selection",
          width: 60
        },
        {
          title: "派送司机",
          key: "OutCar"
        },
        {
          title: "车牌号码",
          key: "OutCarNo"
        },
        {
          title: "运单号",
          key: "BillNumber"
        },
        {
          title: "收货地址",
          key: "GetAddress"
        },
        {
          title: "收货公司",
          key: "GetCompany"
        },
        {
          title: "收货人",
          key: "GetName"
        },
        {
          title: "收货人电话",
          key: "GetTelephone"
        },
        {
          title: "包材类型",
          key: "InCity"
        },
        {
          title: "温度要求",
          key: "WDQJ"
        },
        {
          title: "件数",
          key: "Jian"
        },
        {
          title: "温度计",
          key: "WTNO1"
        },
        {
          title: "出库时间",
          key: "Outtime"
        },
        {
          title: "操作人",
          key: "OutName"
        },
        {
          title: "出港编码",
          key: "OutCode"
        },
        {
          title: "运单状态",
          key: ""
        }
      ]
    };
  },
  methods: {
    //导出

    exportTable() {},
    //重置
    refresh() {
      this.formInline = {};
      this.getData();
    },
    //请求车牌号
    // 这里的接口不要这么写，如果地址变了你一个一个改得累死，抽象出去统一管理 axios有封装好的我给你找个实例
    // async await是promise的语法糖，效果一样，都是用来处理异步请求的 res就是那个结果，他会等接口请求完才会继续执行下边的赋值
    //  请求车牌号方法CarNumber
    async CarNumber() {
      const params = {
        Company: this.userInfo.Company,
        Operate: this.userInfo.Operate,
        Area: this.userInfo.Area
      };
      const res = await getSelectList(params);
      if (res.data.code == 200) {
        this.CarNumberData = res.data.data;
      } else {
        this.$Message.error(res.data.message);
      }
    },
    // 请求司机方法CarNumber
    async driverName() {
      const params = {
        Company: this.userInfo.Company,
        Operate: this.userInfo.Operate,
        Area: this.userInfo.Area
      };
      const res = await getdriverName(params);
      this.driverNameData = res.data.data;
    },
    //获取表格数据
    async getData() {
      this.loading = false;
      const params = {
        Company: this.userInfo.Company,
        City: this.userInfo.City,
        Type: this.isfenpei,
        BillNumber: this.formInline.BillNumber
      };
      const res = await getData(params);
      console.log(res.data.data);
      const dataArr = res.data.data;
      //给指定单元格自定义样式  循环加自定义属性。
      dataArr.forEach(item => {
        if (item.WTNO1 === "使用") {
          item.cellClassName = {
            WTNO1: "demo-table-info-cell-name"
          };
        }
        if (item.WDQJ == "多温区") {
          item.cellClassName = {
            WDQJ: "demo-table-info-cell-name"
          };
        }
      });
      this.tableData = dataArr;
    },

    // 多选
    handleSelectTableItem(selection, row) {
      this.selection = selection;
    },
    //派送
    signin() {
      const len = this.selection.length;

      if (len == 0) {
        this.$Message.error("请选择需要派送的单子");
      } else {
        this.order_id = [];
        let len = this.selection;
        for (let i = 0; i < len.length; i++) {
          console.log(len[i]);
          this.order_id.push(len[i].BillNumber);
          console.log(this.order_id);
          this.getAdd();
        }
      }
    },
    //获取分配司机
    async getAdd() {
      const params = {
        Depart: this.userInfo.Depart,
        City: this.userInfo.City,
        Company: this.userInfo.Company,
        OutCar: this.formInline.driverName,
        OutCarNo: this.formInline.carNumbers,
        UserName: this.userInfo.TrueName,
        BillNumber: this.order_id.join(",")
      };
      const res = await getAdd(params);

      if (res.data.code == 200) {
        this.$Message.success("分配成功");
        this.getData();
      } else {
        this.$Message.error(res.data.msg);
      }
    }
  },
  mounted() {
    // 写个方法获取那个列表，在这调用 初始化
    this.userInfo = JSON.parse(Cookies.get("userInfo"));
    this.CarNumber();
    this.driverName();
    this.getData();
  }
};
</script>
<style>
.ivu-table .demo-table-info-cell-name {
  color: #2d8cf0;
}
</style>