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

            <span @click="development">
              更多操作
              <i style :class="sanja ? 'sanjiao' : 'sanjiao2'"></i>
            </span>
            <div style="float:right">
              <FormItem>
                <Button @click="value1 = true" type="primary">筛选</Button>
                <Drawer :closable="false" v-model="value1">
                  <div
                    style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;"
                  >
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

              <Button type="error" @click="refresh">重置</Button>
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
            <Button type="primary" icon="ios-add" @click="SendDriver">取件司机</Button>
          </i-col>
          <i-col :span="4">
            <FormItem label="总件数">287</FormItem>
            <FormItem label="总票数">52</FormItem>
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
        ref="selection"
        @on-selection-change="handleSelectionChange"
      >
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
          <Button
            type="text"
            size="small"
            style="margin-right: 5px"
            @click="Acknowledgment(row)"
            :disabled="row.IsOk === '1'?true:false"
          >
            <Icon :color="row.IsOk === '0'?'deepskyblue': '#ccc'" type="ios-undo" />
          </Button>
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
    <!-- 取件司机提示框 -->
    <Modal
      v-model="TakeDriverVisible"
      title="取件司机"
      :loading="loading"
      :footer-hide="false"
      :closable="false"
    >


      <Row>
        <Form>
          <FormItem>
            <Select style="width: 211px" v-model="driverName" :transfer="true" filterable clearable>
              <Option
                v-for="(item1,index) in driverNameData"
                :key="index"
                :label="`${item1.TrueName}`+''+` ${item1.UserName}`"
                :value="`${item1.TrueName}`+''+ ` ${item1.UserName}`"
              ></Option>
            </Select>
          </FormItem>
        </Form>
      </Row>
      <div slot="footer">
        <Button type="error" @click="clearTakeDrive">取消</Button>
        <Button type="primary" @click="saveTakeDrive">保存</Button>
      </div>
    </Modal>
    <!-- 取件司机提示框 -->
    <!-- MultipleTemperatureMthosDialog -->
    <Modal
      v-model="MultipleTemperatureMthosDialog"
      title="温度计编码"
      :loading="loading"
      :footer-hide="true"
      :closable="false"
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

    <Modal
      v-model="MultipleBoxDialogMthos"
      title="多种箱型"
      :loading="loading"
      :footer-hide="true"
      :closable="false"
    >
      <table class="mailTable" style="width: 100%;">
        <tr v-for="(index,item) in Boxcontent">
          <td>{{item}}</td>
          <template v-for="(index2,item2) in Boxcontent[item]">
            <td>{{index2.PackageName}}*{{index2.Jian}}</td>
          </template>
        </tr>
      </table>
    </Modal>
    <!-- MultipleBoxDialog -->
    <!-- 单温区订单回复弹框 -->
    <Modal
      v-model="OneOrderReply"
      title="单温区订单回复"
      :loading="loading"
      class-name="vertical-center-modal"
      :closable="false"
      width="50%"
    >
      <Row>
        <Form :model="OrderReplyFrom" inline :label-width="100">
          <Row>
            <i-col>
              <FormItem label="取件时间" :label-width="70">
                <DatePicker
                  type="date"
                  placeholder="Select date"
                  style="width: 200px"
                  v-model="OrderReplyFrom.Time"
                ></DatePicker>
                <TimePicker
                  :disabled-hours="[0,1,2,3,4,5,6,18,19,20,21,22,23]"
                  :steps="[1, 30]"
                  placeholder="Select time"
                  style="width:112px"
                  format="HH:mm"
                  v-model="OrderReplyFrom.hours"
                ></TimePicker>
              </FormItem>

              <div class="my-box">
                <Row>
                  <i-col>
                    <FormItem label="运单号码" style="margin: -25px 0 0;background: #fff">
                      <Input></Input>
                    </FormItem>
                  </i-col>
                </Row>
                <Row>
                  <i-col :xl="5" :lg="24">
                    <FormItem label="客户账号">
                      <Input v-model="OrderReplyFrom.AccountNumber" disabled></Input>
                    </FormItem>
                  </i-col>
                  <i-col :xl="{span: 5, offset: 2}" :lg="24">
                    <FormItem label="目的城市">
                      <Input v-model="OrderReplyFrom.GetCity"></Input>
                    </FormItem>
                  </i-col>
                </Row>
                <Row>
                  <i-col :xl="5" :lg="24">
                    <FormItem label="产品名称">
                      <Input v-model="OrderReplyFrom.CargoName" disabled></Input>
                    </FormItem>
                  </i-col>
                  <i-col :xl="{span: 5, offset: 2}" :lg="24">
                    <FormItem label="体积重量">
                      <Input v-model="OrderReplyFrom.CountWeight" disabled></Input>
                    </FormItem>
                  </i-col>
                  <i-col :xl="5" :lg="24">
                    <FormItem label="产品体积">
                      <Input v-model="OrderReplyFrom.CountVolume" disabled></Input>
                    </FormItem>
                  </i-col>
                  <i-col :xl="5" :lg="24">
                    <FormItem label="产品件数">
                      <Input v-model="OrderReplyFrom.Jian" disabled></Input>
                    </FormItem>
                  </i-col>
                </Row>
                <Row>
                  <i-col :xl="{span: 5, offset: 7}">
                    <FormItem label="货物价值">
                      <Input v-model="OrderReplyFrom.CargoPrice"></Input>
                    </FormItem>
                  </i-col>
                  <i-col :xl="5" :lg="24">
                    <FormItem label="包装前盒数">
                      <Input v-model="OrderReplyFrom.Num"></Input>
                    </FormItem>
                  </i-col>
                  <i-col :xl="5" :lg="24">
                    <FormItem label="产品重量">
                      <Input v-model="OrderReplyFrom.AWeight"></Input>
                    </FormItem>
                  </i-col>
                </Row>
              </div>

              <div class="my-box">
                <Row>
                  <i-col>
                    <FormItem label="温度要求" style="margin: -25px 0 0;background: #fff">
                      <Select v-model="OrderReplyFrom.WDQJ" @on-change="bindSingleTempChange">
                        <Option v-for="(item, index) in requiredTempList" :value="item.WDQJ" :key="index">{{item.WDQJ}}</Option>
                      </Select>
                    </FormItem>
                  </i-col>
                  <i-col>
                    <div style="display: flex;flex-wrap: wrap" class="zhangwq">
                      <template v-for="(item,index) in boxList">
                        <FormItem :label="item.PackageName" :key="index">
                          <Input
                            v-model="OrderReplyFrom[item.PackageName]"
                            style="width: 60px;"
                            :disabled="item.Idisabled"
                            @input="bindInputSinglePackageName($event, item, index)"
                          ></Input>
                        </FormItem>
                      </template>
                    </div>
                  </i-col>
                  <i-col>
                    <template v-for="(item,index) in zibeibao">
                      <FormItem :label="item.PackageName2" :key="index">
                        <Input
                          v-model="OrderReplyFrom.zibeibaoJian2"
                          style="width: 60px;"
                          :disabled="item.Idisabled"
                        ></Input>
                      </FormItem>
                    </template>
                  </i-col>
                </Row>
              </div>
              <div class="bottom-box">
                <Row>
                  <i-col>
                    <FormItem label="货物尺寸" :label-width="70">
                      <Input v-model="OrderReplyFrom.CargoSizeAll" disabled></Input>
                    </FormItem>
                  </i-col>
                  <i-col>
                    <FormItem label="货物条码" :label-width="70">
                      <Input v-model="OrderReplyFrom.BarCod"></Input>
                    </FormItem>
                  </i-col>
                </Row>
              </div>
            </i-col>
          </Row>
        </Form>
      </Row>
      <div slot="footer">
        <Button type="error">取消</Button>
        <Button type="primary">保存</Button>
      </div>
    </Modal>

    <!-- 单温区订单回复弹框 -->
    <!-- 多温区订单回复弹框 -->
    <Modal
      v-model="MoreOrderReply"
      title="多温区订单回复"
      :loading="loading"
      class-name="vertical-center-modal"
      :closable="false"
      width="50%"
    >
      <Form :model="MoreReplyFrom" inline :label-width="100">
        <Row>
          <i-col>
            <FormItem label="取件时间" :label-width="70">
              <DatePicker
                type="date"
                placeholder="Select date"
                style="width: 200px"
                v-model="MoreReplyFrom.Time"
              ></DatePicker>
              <TimePicker
                :disabled-hours="[0,1,2,3,4,5,6,18,19,20,21,22,23]"
                :steps="[1, 30]"
                placeholder="Select time"
                style="width:112px"
                format="HH:mm"
                v-model="MoreReplyFrom.hours"
              ></TimePicker>
            </FormItem>

            <div class="my-box">
              <Row>
                <i-col>
                  <FormItem label="运单号码" style="margin: -25px 0 0;background: #fff">
                    <Input v-model="MoreReplyFrom.BillNumber"></Input>
                  </FormItem>
                </i-col>
              </Row>
              <Row>
                <i-col :xl="5" :lg="24">
                  <FormItem label="客户账号">
                    <Input v-model="MoreReplyFrom.AccountNumber" disabled></Input>
                  </FormItem>
                </i-col>
                <i-col :xl="{span: 5, offset: 2}" :lg="24">
                  <FormItem label="目的城市">
                    <Input v-model="MoreReplyFrom.GetCity"></Input>
                  </FormItem>
                </i-col>
              </Row>
              <Row>
                <i-col :xl="5" :lg="24">
                  <FormItem label="产品名称">
                    <Input v-model="MoreReplyFrom.CargoName" disabled></Input>
                  </FormItem>
                </i-col>
                <i-col :xl="{span: 5, offset: 2}" :lg="24">
                  <FormItem label="体积重量">
                    <Input v-model="MoreReplyFrom.CountWeight" disabled></Input>
                  </FormItem>
                </i-col>
                <i-col :xl="5" :lg="24">
                  <FormItem label="产品体积">
                    <Input v-model="MoreReplyFrom.CountVolume" disabled></Input>
                  </FormItem>
                </i-col>
                <i-col :xl="5" :lg="24">
                  <FormItem label="产品件数">
                    <Input v-model="MoreReplyFrom.Jian" disabled></Input>
                  </FormItem>
                </i-col>
              </Row>
              <Row>
                <i-col :xl="{span: 5, offset: 7}">
                  <FormItem label="产品重量">
                    <Input v-model="MoreReplyFrom.AWeight"></Input>
                  </FormItem>
                </i-col>
                <i-col :xl="5" :lg="24">
                  <FormItem label="温度要求">
                    <Input v-model="MoreReplyFrom.WDQJ"></Input>
                  </FormItem>
                </i-col>
              </Row>
            </div>
            <div class="bottom-box">
              <Row>
                <i-col>
                  <template>
                    <Table border :columns="columns1" :data="MoreOrderList">
                      <template slot-scope="{ row, index }" slot="PackageName">
                        <Select @on-change="bindPackageNameChange($event, row)" v-model="row.PackageName" transfer @on-open-change="getBoxData($event, row)">
                          <Option v-for="(item, sindex) in packageList[index]" :value="item.PackageType" :key="sindex">{{ item.PackageType }}</Option>
                        </Select>
                      </template>
                      <template slot-scope="{ row, index }" slot="Jian">
                        <InputNumber @on-change="bindPackageNameChange(true, row)" :min="1" v-model="row.Jian"></InputNumber>
                      </template>
                      <template slot-scope="{ row, index }" slot="VWeight">
                        <Input v-model="row.VWeight"></Input>
                      </template>
                      <template slot-scope="{ row, index }" slot="Size">
                        <Input v-model="row.Size"></Input>
                      </template>
                    </Table>
                  </template>
                </i-col>
              </Row>
            </div>
            <div class="my-box">
              <Row>
                <i-col>
                  <FormItem label="温度计绑定" style="margin: -25px 0 0;background: #fff"></FormItem>
                </i-col>
                <i-col>
                  <FormItem label="温度要求">
                    <Select v-model="MoreReplyFrom.wdNedda">
                      <Option v-for="(item,i) in boxListBOXS" :key="i" :label="item.WDQJ" :value="item.WDQJ"></Option>
                    </Select>
                  </FormItem>
                  <FormItem label="温度计编码">
                    <Input v-model="MoreReplyFrom.CargoM" @keyup.enter.native="AddwdjNumber"></Input>
                  </FormItem>
                </i-col>
                <i-col>
                  <div v-for="(item, index) in tempNumList" :key="index">
                    <span>{{item.title}}</span>
                    <Tag type="border" v-for="(sItem, sIndex) in item.nums" :key="sIndex" closable color="primary" @on-close="handleCloseTag(index, sIndex)">{{sItem}}</Tag>
                  </div>
                </i-col>
              </Row>
            </div>
          </i-col>
        </Row>
        <div slot="footer">
          <Button type="error" @click>取消</Button>
          <Button type="primary">保存</Button>
        </div>
      </Form>
    </Modal>
    <!-- 多温区订单回复弹框 -->
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
  MultipleBoxMthos,
  OrderTReplyShow,
  DriveNameData,
  saveTakeDriveData,
  ThermometerVerification,
  getBoxData,
  getCheckSize
} from "@/api/taskAllocation";
export default {
  data() {
    return {
      boxListBOXS: [],
      selection: [],
      driverNameData: [], //司机姓名数组
      driverName: "",
      columns1: [
        {
          title: "温度区间",
          key: "WDQJ"
        },
        {
          title: "包装类型",
          key: "PackageName",
          slot: "PackageName"
        },
        {
          title: "件数",
          key: "Jian",
          slot: 'Jian'
        },
        {
          title: "重量",
          key: "VWeight",
          slot: 'VWeight'
        },
        {
          title: "货物尺寸",
          key: "Size",
          slot: 'Size'
        }
      ],
      MoreOrderList: [],
      MoreReplyFrom: {
        Time: "07:0",
        hours: "",
        CargoM:"",
      },
      zibeibaoJian2: "",
      zibeibao: [{ PackageName2: "自备包材重量", Idisabled: true }],
      boxList: [
        { PackageName: "4L", Jian: "", Idisabled: true },
        { PackageName: "12L", Jian: "", Idisabled: true },
        { PackageName: "28L", Jian: "", Idisabled: true },
        { PackageName: "35L", Jian: "", Idisabled: true },
        { PackageName: "45L", Jian: "", Idisabled: true },
        { PackageName: "56L", Jian: "", Idisabled: true },
        { PackageName: "70L", Jian: "", Idisabled: true },
        { PackageName: "97L", Jian: "", Idisabled: true },
        { PackageName: "130L", Jian: "", Idisabled: true },
        { PackageName: "150L", Jian: "", Idisabled: true },
        { PackageName: "CW", Jian: "", Idisabled: true },
        { PackageName: "CW(冬)", Jian: "", Idisabled: true },
        { PackageName: "GB(小)", Jian: "", Idisabled: true },
        { PackageName: "GB(大)", Jian: "", Idisabled: true },
        { PackageName: "新GB(大)", Jian: "", Idisabled: true },
        { PackageName: "A箱", Jian: "", Idisabled: true },
        { PackageName: "B箱", Jian: "", Idisabled: true },
        { PackageName: "托盘保温箱", Jian: "", Idisabled: true },
        { PackageName: "自备包材", Jian: "", Idisabled: true },
        // { PackageName: "自备包材量", Jian: "" ,Idisabled:true, },
        { PackageName: "XS26", Jian: "", Idisabled: true },
        { PackageName: "xs27", Jian: "", Idisabled: true },
        { PackageName: "xs28", Jian: "", Idisabled: true },
        { PackageName: "xs29", Jian: "", Idisabled: true },
        { PackageName: "XPS保温箱", Jian: "", Idisabled: true }
      ],
      OrderReplyFrom: {
        Time: "07:0",
        hours: ""
      },
      OneOrderReply: false, //单温区订单回复
      MoreOrderReply: false, //多温区订单回复
      TakeDriverVisible: false,

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
          width: 220,
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
          width: 120,
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
          width: 130,
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
      limit: 20, //每页条数
      order_id: [],
      packageList: [],
      requiredTempList: [],
      tempNumList: []
    };
  },
  methods: {
    //添加温度计编码
    AddwdjNumber(){
     this.ThermometerVerification()
    },
    bindInputSinglePackageName(e, item, index) {
      this.$set(this.boxList[index], 'Jian', e)
      const lists = this.boxList.filter((sItem, sIndex) => {
        return !sItem.Idisabled && sItem.Jian
      })
      console.log(lists)
      this.getCheckSize('single', lists)
    },
    async bindSingleTempChange(e) {
      this.$set(this.OrderReplyFrom, 'WDQJ', e)
      const res = await this.getOneBoxData({ WDQJ: e, State: 'Box'})
      console.log(res)
      this.BoxContent = res;
      this.boxList.forEach(item => {
        item.Jian = "";
        let index = this.BoxContent.findIndex(v => {
          return item.PackageName === v.PackageType;
        });
        item.Idisabled = index !== -1 ? false : true;
      });
    },
    async getCheckSize(sign, lists) {
      const params = {
        Box: JSON.stringify(lists)
      }
      let res = await getCheckSize(params)
      if(res.data.code === '200') {
        const checkSizeData = res.data
        if(sign === 'single') {
          
          this.$set(this.OrderReplyFrom, 'CountWeight', checkSizeData.CountWeight)
          this.$set(this.OrderReplyFrom, 'CountVolume', checkSizeData.CountVolume)
          this.$set(this.OrderReplyFrom, 'Jian', checkSizeData.CountJian)
          this.$set(this.OrderReplyFrom, 'CargoSizeAll', checkSizeData.CargoSizeAll)
          
        } else {
          this.$set(this.MoreReplyFrom, 'CountWeight', checkSizeData.CountWeight)
          this.$set(this.MoreReplyFrom, 'CountVolume', checkSizeData.CountVolume)
          this.$set(this.MoreReplyFrom, 'BoxJian', checkSizeData.CountJian)
          this.MoreOrderList = checkSizeData.data

        }
      }
    },
    bindPackageNameChange(item, row) {
      this.$set(this.MoreOrderList[row._index], 'PackageName', row.PackageName)
      this.$set(this.MoreOrderList[row._index], 'Jian', row.Jian)
      this.getCheckSize('more', this.MoreOrderList)
    },
    async getBoxData(e, row) {
      if(e) {
        const params = {
          WDQJ: row.WDQJ,
          State: 'Box'
        }
        let res = await getBoxData(params)
        if(res.data.code === '200') {
          this.$set(this.packageList, row._index, res.data.data)
        }
      }
    },
    // 获取 单温区  温度要求
    async getOneBoxData(params) {
      let res = await getBoxData(params)
      if(res.data.code === '200') {
        return res.data.data
      }
    },
    handleSelectionChange(val) {
      this.selection = val;
    },
    //取消
    clearTakeDrive() {
      this.TakeDriverVisible = false;
      this.driverName = "";
    },
    //保存取件司机
    saveTakeDrive() {
      this.saveTakeDriveData();
    },
    handleCloseTag(index, sIndex) {
      if(this.tempNumList[index].nums.length > 1) {
        this.tempNumList[index].nums.splice(sIndex, 1)
      } else {
        this.$delete(this.tempNumList, index)
      }
    },
    initTempNumsList() {
      const tempNumList = JSON.parse(JSON.stringify(this.tempNumList))

      if(tempNumList.length === 0) {
        tempNumList.push({title: this.MoreReplyFrom.wdNedda, nums: [this.MoreReplyFrom.CargoM.trim()]})
      } else {
        const hasKey = tempNumList.some(item => item.title === this.MoreReplyFrom.wdNedda)
        if(hasKey) {
          for(let i = 0; i < tempNumList.length; i++) {

            if(tempNumList[i].title === this.MoreReplyFrom.wdNedda && !tempNumList[i].nums.includes(this.MoreReplyFrom.CargoM.trim())) {
              tempNumList[i].nums.push(this.MoreReplyFrom.CargoM.trim())
              break; 
            }
          }
        } else {
          tempNumList.push({title: this.MoreReplyFrom.wdNedda, nums: [this.MoreReplyFrom.CargoM.trim()]})
        }
      }
      this.tempNumList = tempNumList
    },
    //温度计编码验证
    async ThermometerVerification(){
      const params ={
        WDJ:this.MoreReplyFrom.CargoM,
      };
      const res = await ThermometerVerification(params)
      if(res.data.code ==200){
        this.$Message.success(res.data.msg)
        this.initTempNumsList()

      }else{
        this.$Message.error(res.data.msg)
      }
    },
    //获取分配司机
    async saveTakeDriveData() {
      const params = {
        OrderId: this.order_id.join(","),
        UserName: this.userInfo.UserName,
        DriverName: this.driverName.split(" ")[0],
        DriverCode: this.driverName.split(" ")[1]
      };
      const res = await saveTakeDriveData(params);
      if (res.data.code == "200") {
        this.TakeDriverVisible = false;
        this.$Message.success(res.data.msg);
        this.getData();
      } else {
        this.$Message.error(res.data.msg);
      }
    },
    //派送司机
    SendDriver() {
      let len = this.selection;
      if (len.length == 0) {
        this.$Message.error("请选择需要派送的单子");
      } else {
        this.TakeDriverVisible = true;
        this.order_id = [];
        let len = this.selection;

        for (let i = 0; i < len.length; i++) {
          this.order_id.push(len[i].id);
        }
      }
    },
    //重置
    refresh() {
      this.formInline = {};
      this.initSearchData();
      this.getData();
    },
    //点击订单回复判断是单温区还是多温区
    Acknowledgment(row) {
      this.OrderTReplyShow(row.id, row.WDQJ);
    },
    //司机
    async DriveNameData() {
      const params = {
        Company: this.userInfo.Company,
        Operate: this.userInfo.Operate,
        Area: this.userInfo.Area
      };
      const res = await DriveNameData(params);
      this.driverNameData = res.data.data;
    },
    //订单回复显示
    async OrderTReplyShow(OrderId, WDQJ) {
      const params = { OrderId };
      const res = await OrderTReplyShow(params);
      if (WDQJ !== "多种温区") {
        //单温区订单回复
        this.OneOrderReply = true;
        this.OrderReplyFrom = res.data.data;
        // 调用获取 单温区  温度要求接口
        const requiredTempList = await this.getOneBoxData({
          WDQJ: '',
          State: 'WDQJ'
        })
        console.log(WDQJ)
        this.requiredTempList = requiredTempList;
        this.bindSingleTempChange(WDQJ)

        this.boxList.forEach(function(item) {
          item.Jian = "";

          if (res.data.data.XiangZi && res.data.data.XiangZi.length) {
            res.data.data.XiangZi.forEach(function(item2, index2) {
              if (item2.PackageType == item.PackageName) {
                item.Jian = item2.Jian;
              }
            });
          }
          let index = res.data.data.PackageAll.findIndex(v => {
            return item.PackageName === v.PackageType;
          });
          item.Idisabled = index !== -1 ? false : true;
        });
      } else {
        //多温区订单回复
        this.MoreOrderReply = true;
        this.MoreReplyFrom = res.data.data;
        res.data.data.Box.forEach((item, index) => {
          item.Jian = +item.Jian
          this.$set(this.packageList, index, [{PackageType: item.PackageName}] )
        })
        this.MoreOrderList = res.data.data.Box;

        this.getWdjNee();
      }
    },
    //去重
    getWdjNee(event) {
      const newArr = [];
      this.MoreOrderList.map(
        item =>
          newArr.findIndex(({ WDQJ }) => WDQJ === item.WDQJ) === -1 &&
          newArr.push(item)
      );
      this.boxListBOXS = newArr;

      // this.boxListBOXS.forEach(item => {
      //   this.BoxCargoM[item.WDQJ] = [];
      // });
    },
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
    //获取取件司机
    getdriverName(e) {},
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
      const dateTime = new Date(currentYear, currentMonth, "01", "0", "0", "0").getTime() / 1000;
      const time1 = getDate(dateTime, "year");
      const time2 = getDate(new Date().getTime() / 1000, "year");
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
    this.DriveNameData();
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
.my-box {
  border-radius: 5px;

  padding: 10px;
  margin: 35px 0px 0;
  position: relative;

  border: #06c solid 1px;
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
.bottom-box {
  margin: 10px 0;
}
</style>