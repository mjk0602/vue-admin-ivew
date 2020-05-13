<template>
  <div>
    <Row>
      <i-col>
        <Form ref="formInline" inline :label-width="80" :model="formInline" :rules="ruleValidate">
          <FormItem label="车牌号码" prop="carNumbers">
            <!-- 不要带括号，有参数再写括号  把表单里所有的model统一管理，用一个对象 还有  prop是做表单验证的，就是前边带个小红星必填啥的-->
            <Select v-model="formInline.carNumbers" :transfer="true" filterable>
              <Option v-for="(item,index) in CarNumberData" :value="item" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem label="司机姓名" prop="driverName">
            <Select v-model="formInline.driverName" :transfer="true" filterable>
              <Option
                v-for="(item,index) in driverNameData"
                :value="item.TrueName"
                :key="index"
              >{{ item.TrueName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="运单号" prop="BillNumber">
            <Input v-model="formInline.BillNumber" @keyup.enter.native="addRuku('formInline')"></Input>
          </FormItem>

          <Button type="primary" @click="addRuku('formInline')"" >添加</Button>
        </Form>
      </i-col>
    </Row>
  </div>
</template>

<script>
import Cookies from "js-cookie";
//所有的方法
import { getSelectList, getdriverName ,
VerifyBillNumber} from "@/api/PutStorage";
export default {
  data() {
    return {
      formInline: {
        carNumbers: "",
        driverName: "",
        BillNumber: ""
      },
      ruleValidate: {
        carNumbers: [{required: true,message: "请选择车牌号码",trigger: "change"},],
        driverName: [ {required: true,message: "请选择司机姓名",trigger: "change" },], 
        BillNumber: [
          {required: true,message: "请输入运单号", trigger: "blur" },
          { min: 12, max: 12, message: "运单号长度为12位", trigger: "blur" }
          ]
      },
      driverNameData: [], //司机姓名数组
      CarNumberData: [] //车牌号
    };
  },
  methods: {
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
    //验证运单号码
    async VerifyBillNumber(){
      const params = {
        BillNumber: this.formInline.BillNumber
      };
      const res = await  VerifyBillNumber(params)

      if(res.data.code == 200){
        

      }else{
       this.$Message.error(res.data.msg);
      }
    },
    //入库
    addRuku(name) {
      console.log(111)
      this.$refs[name].validate(valid => {
        if (valid) {
          this.VerifyBillNumber()
          
        } else {
          this.$Message.error("Fail!");
        }
      });
    }
  },
  mounted() {
    // 写个方法获取那个列表，在这调用 初始化
    this.userInfo = JSON.parse(Cookies.get("userInfo"));
    this.CarNumber();
    this.driverName();
  }
};
</script>

<style>
</style>