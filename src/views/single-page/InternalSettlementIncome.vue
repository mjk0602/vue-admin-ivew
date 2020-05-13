<template>
  <div>
    <Row>
      <i-col>
        <Form inline :label-width="98" :model="formInline">
          <FormItem label="要求取件时间">
            <DatePicker
              :value="formInline.TakeTime"
              format="yyyy-MM-dd"
              type="datetimerange"
              placement="bottom-start"
              @on-change="handleChangeTakeTime"
            ></DatePicker>
          </FormItem>
          <FormItem label="结算类型">
            <Select style="width: 211px" v-model="formInline.JSLX" :transfer="true" filterable>
              <Option label="支出" value="支出"></Option>
              <Option label="收入" value="收入"></Option>
            </Select>
          </FormItem>

          <Button type="primary" @click="getData()">搜索</Button>
          <Button type="success" style="margin:0 10px">导出</Button>
          <Button type="error" @click="refresh">重置</Button>
        </Form>
      </i-col>
    </Row>
    <Card>
      <Form inline :label-width="100">
        <Row type="flex" justify="space-between">
          <i-col :span="10">
            <Button type="primary" icon="ios-add">申请</Button>
          </i-col>
          <i-col :span="2">
            <FormItem label="费用总额">287</FormItem>
          </i-col>
        </Row>
      </Form>
      <Table
        size="small"
        border
        :loading="loading"
        stripe
        :columns="columns"
        :data="tableData"
       
      >
        <template slot-scope="{ row, index }" slot="action">
          <Button>审核</Button>
        </template>
      </Table>
    </Card>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { getDate } from "@/libs/tools";
import { getData } from "@/api/InternalSettlementIncome";
export default {
  data() {
    return {
      formInline: {},
      loading: true,
      tableData: [],
      columns: [
        {
          type: "index",
          width: 60,
          align: "center",
          title: "序号"
        },
        {
          title: "结算类型",
          key: "SType"
        },
        {
          title: "费用名称",
          key: "SName"
        },
        {
          title: "金额",
          key: "SMoney"
        },
        {
          title: "发生日期",
          key: "InDate"
        },
        {
          title: "站点名称",
          key: "Company"
        },
        {
          title: "省份",
          key: "Depart"
        },
        {
          title: "城市",
          key: "City"
        },
        {
          title: "申请人",
          key: "InName"
        },
        {
          title: "申请时间",
          key: "InTime"
        },
        {
          title: "审核人",
          key: "OKName"
        },
        {
          title: "审核时间",
          key: "OKTime"
        },
        {
          title: "操作",
          slot: "action"
        }
      ]
    };
  },
  methods: {
    handleChangeTakeTime(data) {
      this.formInline.TakeTime = data;
    },
    //重置
    refresh() {},
    //获取表格数据
    async getData() {
      this.loading = false;
      const params = {
        UserName: this.userInfo.UserName,
        BeginTime: this.formInline.TakeTime[0],
        EndTime: this.formInline.TakeTime[1],
        JSLX: this.formInline.JSLX
      };
      const res = await getData(params);
      console.log(res.data.data);
      const dataArr = res.data.data;
      if (res.data.code == 200) {
        this.tableData = dataArr;
      } else {
        this.$Message.error(res.data.msg);
      }
    },

    //初始化搜索的默认值
    initSearchData() {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const dateTime =
        new Date(currentYear, currentMonth, "01", "0", "0", "0").getTime() /
        1000;
      const time1 = getDate(dateTime, "year").substring(0, 10); // 对吧

      const time2 = getDate(new Date().getTime() / 1000, "year").substring(
        0,
        10
      );
      console.log(time2);
      this.formInline.TakeTime = [time1, time2];
    }
  },
  created() {
    this.initSearchData();
  },
  mounted() {
    // 写个方法获取那个列表，在这调用 初始化
    this.userInfo = JSON.parse(Cookies.get("userInfo"));
    //console.log(this.userInfo)

    this.getData();
  }
};
</script>

<style lang="scss" scoped>
</style>