<template>
  <div>
    <Row>
      <i-col>
        <Form inline :label-width="100" :model="formInline">
          <Row>
            <i-col>
              <Form-item label="预计到达时间">
                <DatePicker
                  :value="formInline.BeginPreInTime"
                  format="yyyy/MM/dd"
                  type="daterange"
                  placement="bottom-start"
                  placeholder="Select date"
                  style="width: 200px"
                ></DatePicker>
              </Form-item>
              <Form-item label="运输方式">
                <Select v-model="formInline.WayOut" :transfer="true" filterable></Select>
              </Form-item>
              <Form-item label="承运商">
                <Select v-model="formInline.CYCompany" :transfer="true" filterable></Select>
              </Form-item>
              <Form-item label="承运单号">
                <Select v-model="formInline.CYNumber" :transfer="true" filterable></Select>
              </Form-item>
            </i-col>
            <i-col>
              <Form-item label="运单号">
                <Select v-model="formInline.BillNumber" :transfer="true" filterable></Select>
              </Form-item>
              <Form-item>
                <Button type="primary">搜索</Button>

                <Button type="success" style="margin:0 10px">导出</Button>

                <Button type="error">重置</Button>
              </Form-item>
            </i-col>
          </Row>
        </Form>
      </i-col>
    </Row>
    <Card>
      <Row>
        <i-col :span="24">
          <div>
            <Form inline>
              <FormItem>
                <Button type="primary" icon="ios-add">进港预报</Button>
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
          >
            <template slot-scope="{ row, index }" slot="CYCompany">
              <Poptip transfer trigger="hover" :title="row.CYCompany">
                  <span slot="content">
                    航班车次：{{row.CYNO}}<br>运输方式：{{row.WayOut}}<br>出港编码：{{row.OutCode}}
                  </span>
                  <span style="text-decoration: underline">{{row.CYCompany}}</span>
              </Poptip>
            </template>
          </Table>
        </i-col>
      </Row>
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
  </div>
</template>

<script>
import Cookies from "js-cookie";
//所有的方法
import { getData } from "@/api/EntryNotice";
export default {
  data() {
    return {
      formInline: {
        BeginPreInTime: "",
        WayOut: "",
        CYCompany: "",
        CYNumber: "",
        BillNumber: ""
      },
      total: 0, //总条数
      page: 1, //当前页
      limit: 20, //每页条数
      value2: [],
      tableData: [], //表格数据
      loading: true,
      columns: [
        {
          type: "selection",
          width: 60,
          fixed: "left"
        },
        {
          title: "温度计回收",
          key: "WayNo",
          width: 100
        },
        {
          title: "换冰提醒",
          key: "InDate",
          width: 100
        },
        {
          title: "运单号",
          key: "BillNumber",
          width: 200
        },
        {
          title: "客户账号",
          key: "AccountNumber",
          width: 100
        },
        {
          title: "承运单号",
          key: "CYNumber",
          
          width: 200
        },
        {
          title: "承运商",
          slot: 'CYCompany',
          key: "CYCompany",
          width: 200
        },
        {
          title: "货物名称",
          key: "Cargoname",
          width: 100
        },
        {
          title: "件数",
          key: "Jian",
          width: 100
        },
        {
          title: "温度区间",
          key: "WDQJ",
          width: 100
        },
        {
          title: "发出网络公司",
          key: "FromCompany",
          width: 200
        },
        {
          title: "中转网络公司",
          key: "ToCompany",
          width: 200
        },
        {
          title: "收货公司",
          key: "GetCompany",
          width: 200
        },
        {
          title: "出港时间",
          key: "OutTime",
          width: 200
        },
        {
          title: "预计到达时间",
          key: "PreInTime",
          width: 200
        },
        {
          title: "备注",
          key: "Attention",
          width: 300,
          fixed: "right"
        }
      ]
    };
  },
  methods: {
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
    // 多选
    handleSelectTableItem(selection, row) {
      this.selection = selection;
    },
    //获取表格数据
    async getData(page) {
      const params = {
        Company: this.userInfo.Company,
        City: this.userInfo.City,
        WayOut: this.formInline.WayOut,
        BeginPreInTime: this.formInline.BeginPreInTime[0] || "",
        EndPreInTime: this.formInline.BeginPreInTime[1] || "",
        CYCompany: this.formInline.CYCompany,
        CYNumber: this.formInline.CYNumber,
        BillNumber: this.formInline.BillNumber
      };
      if (page) {
        Object.assign(params, page);
      }
      const res = await getData(params);

      this.loading = false;
      console.log(res.data.data);
      const dataArr = res.data.data;
      this.tableData = dataArr;
      this.total = res.data.Sum;
    }
  },
  mounted() {
    // 写个方法获取那个列表，在这调用 初始化
    this.userInfo = JSON.parse(Cookies.get("userInfo"));

    this.getData();
  }
};
</script>

<style>
</style>