<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 活动下群二维码管理页面
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <!--<el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>-->
                <el-button type="primary" icon="el-icon-lx-add" @click="addEdit">添加活动</el-button>
                
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="序号" width="55" align="center"></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                <!--<el-table-column label="二维码" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="strimg+scope.row.qrcode"
                        ></el-image>
                    </template>
                </el-table-column>-->
                <el-table-column prop="num" label="用户扫码次数"></el-table-column>
                
                <el-table-column label="有效期限">
                    <template slot-scope="scope">{{scope.row.expire | updatetime("yyyy-mm-dd")}}</template>
                </el-table-column>
                <el-table-column prop="region" label="可见区域"></el-table-column>
                
      
                <!--<el-table-column label="提示图片" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="strimg+scope.row.url"
                        ></el-image>
                    </template>
                </el-table-column>-->
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                        
                       
                        
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="page"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
                <!--layout	组件布局，子组件名用逗号分隔	String	sizes, prev, pager, next, jumper-->
                <!--current-page  当前页-->
                
                <!--total :总条目数-->
                <!--page-count 总页数-->
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="名称" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="扫码次数" prop="num">
                    <el-input v-model="form.num"></el-input>
                </el-form-item>
                
               	<el-form-item label="提示图片" prop="">
                    <el-upload
                      ref="uploadImg"
					  action="#"
					  multiple
					  :limit="100"
					  list-type="picture-card"
					  :auto-upload="false"
					  :on-change="changImg"
					  :file-list="fileList"
					  >
					    <i slot="default" class="el-icon-plus"></i>
					    <div slot="file" slot-scope="{file}">
					      <img
					        class="el-upload-list__item-thumbnail"
					        :src="file.url" alt=""
					      >
					      <span class="el-upload-list__item-actions">
					        
					        <span
					          v-if="!disabled"
					          class="el-upload-list__item-delete"
					          @click="handleRemove(file)"
					        >
					          <i class="el-icon-delete"></i>
					        </span>
					      </span>
					    </div>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
					  <img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
                </el-form-item>
                
                <el-form-item label="有效时间" prop="expire">
                    <el-date-picker
				      v-model="form.expire"
				      type="date"
				      placeholder="选择日期">
				    </el-date-picker>
                </el-form-item>	
                
                <el-form-item label="可见区域" prop="region">
                    <el-input v-model="form.region" placeholder="例如：黑龙江省哈尔滨市"></el-input>
                </el-form-item>
                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
//import { fetchData } from '../../api/index';
import qs from 'qs'
export default {
    name: 'basetable',
    data() {
        return {
        	value1: '',
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                _url:""
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            
            title:"添加",
            
            dialogImageUrl: '',
	        dialogVisible: false,
	        disabled: false,
	        
	        page:1,
	        limit:10,
	        strimg:'http://qrcode.aixiaoqu98.com/public/',
	        ymcount:"",
	        fileList:[],
	        
	        editId:"",
	        editImgName:'',
	        
			url_list:[],
			ztnm_list:[],
			sb_id:'1'
        };
    },
    watch:{
        '$route'(){
			this.sb_id = this.$route.query.id
            this.getData();
        }
    },
    created() {
    	
        this.getData();
        
    },
    filters:{
    	"updatetime":function(data,str){
     			var time = new Date(data)
     			var y = time.getFullYear()
     			var m = (time.getMonth()+1).toString().padStart(2,0)
     			var d = time.getDate().toString().padStart(2,0)
     			
     			var h = time.getHours().toString().padStart(2,0)
     			var s = time.getMinutes().toString().padStart(2,0)
     			var mm = time.getSeconds().toString().padStart(2,0)
     			
     			if(str && str.toLowerCase()=="yyyy-mm-dd"){
     				return y+"-"+m+"-"+d
     			}else{
     				return y+"-"+m+"-"+d+" "+h+":"+s+":"+mm
     			}
     			
     	}
    },
    methods: {
        //获取传递的参数
        getData() {
            var _from = new URLSearchParams()
            _from.append("id", parseInt(this.$route.query.id))
			_from.append("page", this.page)
			_from.append("limit", this.limit)
            this.$axios({
	            url: 'http://2wm.aixiaoqu98.com/public/index.php/admin/qrcode/qrList', 
	            method: 'post',
	            data: _from
	          }).then(res => {
	          	console.log(res)
//	          	console.log(res.data.count )
	            if (res.status === 200) {

					this.pageTotal = res.data.count   
					this.tableData = res.data.data
					this.strimg = res.data.path+'/public/'
//	            	console.log(this.tableData)
	            } else {
	              
	            }
	        })
        },
        //新增 自己新增
        addEdit(){
        	this.form = {}
        	this.url_list = []
        	this.editVisible = true;  //这是控制 矿体弹出的
        	this.disabled = true;
        	this.title="添加"
        	
        	this.$refs["form"].resetFields()
			this.$refs.uploadImg.clearFiles()
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {

        	var removeid = []
        	removeid.push(row.id)
//			console.log(removeid)
			var removelist = {id:removeid}
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
            	
	            this.$axios({
		            url: 'http://2wm.aixiaoqu98.com/public/index.php/admin/qrcode/deleteQr',
		            method: 'post',
		            data: qs.stringify({id: removeid})
		        }).then(res => {
		          	
//		          	console.log(res)
		            if (res.status === 200) {
						this.$message.success('删除成功');
						this.tableData.splice(index, 1);
						if(this.tableData.length==0){
			 				this.page = this.page-1
			 			}
//              		
                		this.getData()
		            } else {
		              	this.$message.success('删除失败');
		            }
		        })
            	
                
            })
            .catch(() => {});
        },
        see(index, row){
//      	console.log(row)
        	this.$router.push('/login?id='+row.id)
        },
        // 多选操作
        handleSelectionChange(val) {
        	
        	
            this.multipleSelection = val;
//          console.log(this.multipleSelection)
//          console.log(val)
        },
        delAllSelection() {
//      	const length = this.multipleSelection;
//      	console.log(length)
//      	for(let i = 0; i < length.length; i++){
//      		length[i].id
//      		this.multipleSelection[i].id
//      	}

            const length = this.multipleSelection.length; //选中的对象
            let str = '';
            var removeIdLIst = [] 
//          this.delList = this.delList.concat(this.multipleSelection);
//          console.log(this.delList)
            for (let i = 0; i < length; i++) {
//          	console.log(this.multipleSelection[i].id)
            	removeIdLIst.push(this.multipleSelection[i].id)
                str += this.multipleSelection[i].title + ' '; 
            }    
            if(length==this.tableData.length){
            	this.page = this.page-1
            }
//          console.log(removeIdLIst)
			this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {     
				this.$axios({
					url: 'http://2wm.aixiaoqu98.com/public/index.php/admin/qrcode/deleteQr',
					method: 'post',
					data: qs.stringify({id: removeIdLIst})
					
				}).then(res => {
				
	//	          	console.log(res)
					if (res.status === 200) {
	//					console.log(removeIdLIst)
						
						this.getData()		
						this.$message.error(`删除了${str}`);
						this.multipleSelection = [];
					} else {
						this.$message.success('删除失败');
					}
				})
			})

        },
        // 编辑操作
        handleEdit(index, row) {
        	this.fileList = []
        	this.editImgName = []
        	this.ztnm_list = []
        	this.title="编辑"
            this.idx = index;
            this.form = row;
            this.editId = row.id
            this.disabled2 = true
            this.disabled = false;
            this.editImgName = row.url
//          console.log(row.url)
            var imglist
            for(var i=0;i<row.url.length;i++){
            	imglist = {name:row.url[i].url.split("/")[1],url:this.strimg+row.url[i].url}
            	this.fileList.push(imglist)
            	this.ztnm_list.push(row.url[i].url)
            }
            console.log(this.ztnm_list)
            
//          var imglist = {name:row.url.split("/")[1],url:this.strimg+row.url}
            
            this.editVisible = true;
            


        },
        // 保存编辑
        saveEdit() {
        	
        	if(this.title=="添加"){
        		if(this.query._url&&this.form.title&&this.form.num&&this.form.expire){
        			var _from = new URLSearchParams() 
        		
	        		if(this.url_list.length>1){
						_from.append("url",this.url_list.join("%"))
	        		}else{
	        			_from.append("url",this.query._url)
	        		}
	        		
	        		if(this.form.region){
						_from.append("region",this.form.region)
					}else{
						_from.append("region",'')
					}
	        		_from.append("aid",this.$route.query.id)
	        		_from.append("title",this.form.title)
	        		_from.append("num",this.form.num)
	        		
	        		
	        		var time = new Date(this.form.expire)
	     			var y = time.getFullYear()
	     			var m = (time.getMonth()+1).toString().padStart(2,0)
	     			var d = time.getDate().toString().padStart(2,0)
	     			
	     			this.form.expire = y+"-"+m+"-"+d
	     			
	     			_from.append("expire",this.form.expire)
//	     			console.log(this.form.expire)
	        		this.$axios({
	        			url:"http://2wm.aixiaoqu98.com/public/index.php/admin/qrcode/qrCreate",
	        			method:"post",
	        			data:_from
		        	}).then(res =>{
//		        		console.log(res)
		        		if(res.status ==200){
		//      			this.$refs.form.resetFields();
		//      			this.$refs.upload.clearFiles();
							this.url_list = []
							this.$refs["form"].resetFields()
							this.$refs.uploadImg.clearFiles()
		        			this.editVisible = false;
		        			this.getData()
		//					this.$refs.form.resetFields()
		
		        		}else{
		        			this.$message.error('添加失败');
		        		}
		        	})
        		}
        		
        		
        	}else{
        		if(this.ztnm_list&&this.form.title&&this.form.num&&this.form.expire){
	        		var _from = new URLSearchParams() 
	        		var z_img_list = []
	        		if(this.ztnm_list.length>1){
	//					this.ztnm_list
//						for(var i=0;i<this.ztnm_list.length;i++){
//							z_img_list.push(this.ztnm_list[i].url)
//						}
						
						_from.append("url",this.ztnm_list.join("%"))
						
	//					alert(1)
	        		}else{
	        			_from.append("url",this.ztnm_list)
//	        			console.log(this.ztnm_list)
//	        			console.log(this.ztnm_list[0].url)
	        			
	        		}
	        		
	        		
	//      		console.log(this.editImgName)
	    			
	    			_from.append("qid",this.editId)
	        		_from.append("title",this.form.title)
	        		_from.append("num",this.form.num)
	        		
	        		var time = new Date(this.form.expire)
	     			var y = time.getFullYear()
	     			var m = (time.getMonth()+1).toString().padStart(2,0)
	     			var d = time.getDate().toString().padStart(2,0)
	     			
	     			this.form.expire = y+"-"+m+"-"+d
	     			
	     			_from.append("expire",this.form.expire)
//	        		console.log(this.form.expire)
	        		
	        		// _from.append("region",this.form.region)
	        		if(this.form.region){
						_from.append("region",this.form.region)
					}else{
						_from.append("region",'')
					}
	        		this.$axios({
	        			url:"http://2wm.aixiaoqu98.com/public/index.php/admin/qrcode/qrUpdate",
	        			method:"post",
	        			data:_from
		        	}).then(res =>{
		        		
	        		
		        		if(res.status ==200){
	      			
		        			this.editVisible = false;
		        			this.getData()
							this.$message.success(`修改第 ${this.idx + 1} 行成功`);
							
		        		}else{
		        			this.$message.error('添加失败');
		        		}
		        	})
	        	}
            	   
            	
//          	this.$set(this.tableData, this.idx, this.form);	
        	}

        },
        // 分页导航
        handlePageChange(val) {
//          this.$set(this.query, 'pageIndex', val);
//         	console.log(val)
            this.page = val
            this.getData();
        },
        
        handleRemove(file) {
        	var imglist
        	for(var i=0;i<this.ztnm_list.length;i++){
				
				if(this.ztnm_list[i].split("/")[1].indexOf(file.name)!=-1){
					this.ztnm_list.splice(i,1)
				}
			}
        	for(var j=0;j<this.editImgName.length;j++){
				
				if(this.editImgName[j].url.split("/")[1].indexOf(file.name)!=-1){
					this.editImgName.splice(j,1)
					this.fileList = []
					for(var k=0;k<this.editImgName.length;k++){
//						console.log(this.editImgName[k])
						imglist = {name:this.editImgName[k].url.split("/")[1],url:this.strimg+this.editImgName[k].url}
            			
//						console.log(imglist)
            			this.fileList.push(imglist)
					}
					
				}
//				console.log(this.editImgName[j].split("/")[1],url:this.strimg+this.editImgName[j])
//				imglist = {name:this.editImgName[j].split("/")[1],url:this.strimg+this.editImgName[j]}
//          	this.fileList.push(imglist)
			}   	
//      	console.log(this.ztnm_list); 	
//      	console.log(this.editImgName);
	    },
	    //上传图片
	    changImg(file){
		// console.log(this.$refs.uploadImg.uploadFiles)
		// console.log(file.raw)
	    	if(this.title=="添加"){
	    		var formData = new FormData();
        	
				formData.append("file", file.raw);
		    	console.log(formData.getAll('file'))
		    	this.$axios({
	        		url:"http://2wm.aixiaoqu98.com/public/index.php/admin/qrcode/uploads",
	        		method:"post",
	        		data:formData
	        	}).then(res =>{
	        		console.log(res)
	        		if(res.status ==200){
	        			var imgArr = []
			            imgArr.push(res.data)
			            this.query._url = imgArr
			            this.url_list =  this.url_list.concat(this.query._url);
			              
	//		             console.log(this.url_list)
	//		             this.disabled2 = true
	//        			
	        		}else{
	        			this.$message.error('上传失败');
	        		}
	        	})
	    	}else{
	    		var formData = new FormData();
				formData.append("file", file.raw);
		    	this.$axios({
	        		url:"http://2wm.aixiaoqu98.com/public/index.php/admin/qrcode/uploads",
	        		method:"post",
	        		data:formData
	        	}).then(res =>{
	        		if(res.status ==200){
	        			var imgArr = []
			            imgArr.push(res.data)
			            this.query._url = imgArr
			            this.ztnm_list =  this.ztnm_list.concat(this.query._url);
	//			        console.log(this.editImgName)
	//			        console.log(this.ztnm_list)
	//		            this.disabled2 = true
	        		}else{
	        			this.$message.error('上传失败');
	        		}
	        	})
	    	}
	    	
//	    	console.log(file.raw)
	    }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
