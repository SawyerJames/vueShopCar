var vm = new Vue({
    el: '#app',
    data: {
        totalMoney: 0,
        productList: [],
        checkAllFlag: false,
        delFlag: false,
        curProduct: ''
    },
    filters: {
        formatMoney: function(val) {
            return "$" + val.toFixed(2);
        }
    },
    mounted: function() {
        // 为了防止mounted函数出现问题，内层加入$nextTick函数用来二次初始化
        this.$nextTick(function() {
            this.cartView();
            this.calcTotalPrice();
        })
    },
    methods: {
        cartView: function() {
            // 在实例中，this都指代vue实例，如果函数内部需要使用this指定对象，需要变量重新赋值
            var that = this;
            // this指的是vue实例->像小程序一样this指代page实例
            // then: 回调函数的入口
            axios.get("data/cartData.json").then(res => {
                that.productList = res.data.result.list;
                // that.totalMoney = res.data.result.totalMoney;
            });
        },
        changeMoney: function(product, way) {
            if (way > 0) {
                product.productQuantity++;
            } else {
                product.productQuantity--;
                if (product.productQuantity < 1) product.productQuantity = 1;
            }
            this.calcTotalPrice();
        },
        selectedProduct: function(item) {
            if (typeof item.checked == 'undefined') {
                this.$set(item, "checked", true);
            } else {
                // 改变当前的checked的值
                item.checked = !item.checked;
            }
            this.calcTotalPrice();
        },
        checkAll: function(flag) {
            // 传的参数：true为全选
            this.checkAllFlag = flag;
            var that = this;
            // 遍历当前的信息
            this.productList.forEach(function(item, index) {
                // 不管checked有没有，都将其赋值为checkAllFlag的值
                // 如果没有checked，就先创建一个checked
                // 属于主控，checkAllFlag为true，则所有的checked都为true
                if (typeof item.checked == 'undefined') {
                    that.$set(item, "checked", that.checkAllFlag);
                } else {
                    item.checked = that.checkAllFlag;
                }
            });
            this.calcTotalPrice();
        },
        calcTotalPrice: function() {
        	var that = this;
            this.totalMoney = 0;
            this.productList.forEach(function(item, index) {
            	if(item.checked){
            		that.totalMoney += item.productPrice*item.productQuantity;
            	}
            });
        },
        delConfirm: function (item){
            // 先更改删除为true，再将这个要删除的项存到data中
            this.delFlag = true;
            this.curProduct = item;
        },
        delProduct: function (){
            // 模拟删除，其实应该将要删除的项id传递给后台，后台删除后返回一个字段删除成功
            // 获取到data中的要删除项，查其索引
            var index = this.productList.indexOf(this.curProduct);
            // jsonp的删除处理方法，splice(从哪个元素删起，删几个元素)
            this.productList.splice(index,1);
            this.delFlag = false;
        }
    }
});
