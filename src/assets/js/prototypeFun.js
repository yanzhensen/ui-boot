export default (Vue) => {
  Vue.prototype.submitForm = function submitForm(formName) { //form表单验证 formName=[ref]
    let state = true
    for (let i of formName) {
      this.$refs[i].validate((valid) => {
        if (valid) {
          console.log(valid, 1)
          state = true
        } else {
          console.log(valid, 0)
          state = false
          return
        }
      })
      if (state == false) {
        return state
      }
    }
    return state
  }
  Vue.prototype.resetForm = function resetForm(formName) {//form表单清空
    this.$nextTick(() => {
      formName.forEach(element => {
        this.$refs[element].clearValidate(); //不清除name
      })
    })
  }
  Vue.prototype.clearForm = function clearForm(formName) { //form表单清空
    formName.forEach(element => {
      this.$refs[element].resetFields(); //清除name
      // that.$refs[element].clearValidate(); //不清除name
    })
  }
  Vue.prototype.randomNumber = function randomNumber() { //生成随机编号
    let strNumber = '';
    let myDate = new Date();
    let year = myDate.getFullYear();
    let month = myDate.getMonth() + 1;
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    let day = myDate.getDate();
    if (day >= 0 && day <= 9) {
      day = "0" + day;
    }
    let rnd = "";
    for (let i = 0; i < 6; i++) {
      rnd += Math.floor(Math.random() * 10);
    }
    let yearStr = year.toString().substring(2, 4);
    strNumber = yearStr + month + day + rnd;
    return strNumber;
  },
    Vue.prototype.accAdd = function accAdd(arg1, arg2) { //加法
      if (arg1 == '' || arg1 == null) {
        arg1 = 0;
      }
      if (arg2 == '' || arg2 == null) {
        arg2 = 0;
      }
      var r1, r2, m, c;
      try {
        r1 = arg1.toString().split(".")[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split(".")[1].length;
      } catch (e) {
        r2 = 0;
      }
      c = Math.abs(r1 - r2);
      m = Math.pow(10, Math.max(r1, r2));
      if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
          arg1 = Number(arg1.toString().replace(".", ""));
          arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
          arg1 = Number(arg1.toString().replace(".", "")) * cm;
          arg2 = Number(arg2.toString().replace(".", ""));
        }
      } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
      }
      return ((arg1 + arg2) / m).toFixed(2);
    }
  Vue.prototype.accSub = function accSub(arg1, arg2) { //减法
    if (arg1 == '' || arg1 == null) {
      arg1 = 0;
    }
    if (arg2 == '' || arg2 == null) {
      arg2 = 0;
    }
    var r1, r2, m, n;
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); // last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(2);
  }
  Vue.prototype.accMul = function accMul(arg1, arg2) { //乘法
    if (arg1 == '' || arg1 == null) {
      arg1 = 0;
    }
    if (arg2 == '' || arg2 == null) {
      arg2 = 0;
    }
    var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length;
    } catch (e) {
    }
    try {
      m += s2.split(".")[1].length;
    } catch (e) {
    }
    return (Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)).toFixed(2);
  }
  Vue.prototype.accChu = function accChu(arg1, arg2) { //除法
    if (arg1 == '' || arg1 == null) {
      arg1 = 0;
    }
    if (arg2 == '' || arg2 == null) {
      arg2 = 0;
    }
    var t1 = 0,
      t2 = 0,
      r1, r2;
    try {
      t1 = arg1.toString().split(".")[1].length;
    } catch (e) {
    }
    try {
      t2 = arg2.toString().split(".")[1].length;
    } catch (e) {
    }
    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return ((r1 / r2) * Math.pow(10, t2 - t1)).toFixed(2);
  }
  Vue.prototype.powerCalculate = function powerCalculate(step_arr, total_num) { //计费方案 计算水电气收费
    if (!step_arr) {
      return 0;
    }
    step_arr = eval("(" + step_arr + ")")
    let baseMoney = step_arr.baseMoney; //基础计费
    let ladder = step_arr.ladder; //阶梯方案
    let total_price = 0; //计费值
    //变量step_chosen就是一共需要爬梯的数量
    let step_chosen = undefined;
    //1、先求出，可以最多使用到哪一个阶梯
    for (let i = 0; i < ladder.length; i++) {
      if (parseInt(total_num) < parseInt(ladder[i].step)) {
        if (this.accSub(ladder[i].step, total_num) < 1) {
          step_chosen = i + 1;
          break;
        } else {
          step_chosen = i;
          break;
        }
      }
    } //0-10   11-00
    if (step_chosen == undefined) {
      //2、如果数量级超过最大阶梯的话
      step_chosen = ladder.length;
    } else {
      //3、如果数量级不超过最大阶梯的话，值不变

    }
    //变量step_chosen就是一共需要爬梯的数量
    for (let i = 0; i < step_chosen; i++) {
      if (step_chosen == 1) { //如果只有一阶，直接计算
        total_price += total_num * ladder[0].price;
      } else {
        if (i == (step_chosen - 1)) {

          total_price = this.accAdd(total_price, ((total_num - ladder[i].step + 1) * ladder[i].price));
        } else {
          if (ladder[i].step == 0) {
            total_price = this.accAdd(total_price, ((ladder[i + 1].step - ladder[i].step - 1) * ladder[i].price));
          } else {
            total_price = this.accAdd(total_price, ((ladder[i + 1].step - ladder[i].step) * ladder[i].price));
          }
        }
      }
    }
    return this.accAdd(baseMoney, total_price);
  }
  Vue.prototype.checkUser = function checkUser(id) { //用户级联选择器回显函数
    if (!id) {
      return
    }
    let list = []
    this.$store.state.userNameList.forEach(item => {
      item.children.forEach(item2 => {
        item2.children.forEach(item3 => {
          if (item3.value == id) {
            list = [item.value, item2.value, item3.value]
          }
        })
      })
    })
    console.log(list)
    return list
  }
  Vue.prototype.numberChinese = function numberChinese(str) { //金额转中文
    let num = parseFloat(str);
    let strOutput = "",
      strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
    num += "00";
    let intPos = num.indexOf('.');
    if (intPos >= 0) {
      num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
    }
    strUnit = strUnit.substr(strUnit.length - num.length);
    for (let i = 0; i < num.length; i++) {
      strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
    }
    return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元")
  }
  Vue.prototype.checkContractNumber = function checkContractNumber(num) { //票据编号检测

    return this.$axios.post(`/apartment/contractNumber/${num}/detection`).then(res => {
      return res.data.result.jcdId
    }).catch(err => {
      return err.response.data.msg
    })

  }
  Vue.prototype.timer = ''
  Vue.prototype.searchOnkeyup = function searchOnkeyup(callback) { //筛选框input事件防抖
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      callback(1) //传入的分页请求函数
    }, 800)
  }
  Vue.prototype.isError = function isError(error) { //判断状态码自定义错误信息
    console.log(1, this)
    switch (error.response.status) {
      case 401:
        console.log(2, this)
        this.$message({
          showClose: true,
          duration: 6000,
          message: `${error.response.data.msg}`,
          type: 'error'
        })
        sessionStorage.clear('token')
        break
      default:
        console.log(3, this)
        this.$message({
          showClose: true,
          duration: 6000,
          message: `${error.response.data.msg}`,
          type: 'error'
        })
    }
  }
  Vue.prototype.financialCoding = function financialCoding() { //票据编号随机数
    let date = new Date()
    let getTime = date.getFullYear().toString() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds() + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10)
    console.log(getTime)
    return getTime
  }
  Vue.prototype.getIndex = (arr, row, state, that) => { //上一条
    for (let i in arr) {
      if (arr[i] == row) {
        if (state) {
          if (i < arr.length - 1) {
            return arr[Number(i) + 1]
          } else {
            that.$message.warning('已是最后一条')
            return arr[arr.length - 1]
          }
        } else {
          if (i > 0) {
            return arr[Number(i) - 1]
          } else {
            that.$message.warning('已是第一条')
            return arr[0]
          }
        }
      }
    }
  }
}
