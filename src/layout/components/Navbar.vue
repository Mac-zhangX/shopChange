<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a> -->
          <!-- <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided>
            <span style="display:block;" @click="checkPass">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!--    编辑模态框-->
    <el-dialog
      width="40%"
      :close-on-click-modal="false"
      title="修改密码"
      center
      :visible.sync="dialogFormVisibleEdit"
      @close="closeDialog('editForm')"
    >
      <el-form ref="editForm" :model="editForm" :rules="editRule" label-width="100px" class="demo-ruleForm">
        <el-form-item label="旧密码:" prop="password" :label-width="formLabelWidth">
          <el-input v-model="editForm.password" type="password"/>
        </el-form-item>
        <el-form-item label="新密码:" prop="newPassword" :label-width="formLabelWidth">
          <el-input v-model="editForm.newPassword" type="password"/>
        </el-form-item>
        <el-form-item label="确认密码:" prop="checkNewWord" :label-width="formLabelWidth">
          <el-input v-model="editForm.checkNewWord" type="password" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('editForm')">取 消</el-button>
        <el-button type="primary" @click="submitFormGoods('editForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import Breadcrumb from '@/components/Breadcrumb'
    import Hamburger from '@/components/Hamburger'
    import {removeToken} from '../../utils/auth'
    import { newPass } from '../../api/modeList'
    export default {
        data() {

            var validatePass1 = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请输入旧密码"));
                }else {
                    callback();
                }
            };
            var validatePass = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请输入新密码"));
                } else {
                    if (this.editForm.checknewpass !== "") {
                        this.$refs.editForm.validateField("checkNewWord");
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请再次输入新密码"));
                } else if (value !== this.editForm.newPassword) {
                    callback(new Error("两次输入密码不一致!"));
                } else {
                    callback();
                }
            };

            return {
                dialogFormVisibleEdit: false,
                editForm: {
                    password: '',
                    newPassword: '',
                    checkNewWord: ''
                },
                editRule: {
                    password: [
                        {
                            validator: validatePass1,
                            required: true,
                            trigger: "blur"
                        }
                    ],
                    newPassword: [
                        {
                            validator: validatePass,
                            required: true,
                            trigger: "blur"
                        }
                    ],
                    checkNewWord: [
                        {
                            validator: validatePass2,
                            required: true,
                            trigger: "blur"
                        }
                    ]
                },
                formLabelWidth: '100px'
            }
        },
        components: {
            Breadcrumb,
            Hamburger
        },
        computed: {
            ...mapGetters([
                'sidebar',
                'avatar'
            ])
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('app/toggleSideBar')
            },
            async logout() {
                // 清除token
                localStorage.removeItem('accessToken');
                sessionStorage.removeItem('password');
                sessionStorage.removeItem('statusInfo');
                location.reload(); // 刷新页面
                this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            },
            checkPass() {
                this.dialogFormVisibleEdit = true;
            },
            submitFormGoods(formName) {
                this.$refs[formName].validate((valid) =>{
                    if(valid) {
                        let params = {
                            password: this.editForm.password,
                            newPassword: this.editForm.newPassword
                        };
                        newPass(params).then((res) =>{
                            if(res.data.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功',
                                    duration: 1000
                                });
                                this.dialogFormVisibleEdit = false;
                            }else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.msg,
                                    duration: 1000
                                });
                                // this.dialogFormVisibleEdit = false;
                            }
                        })
                    }
                });

            },
            closeDialog(formName) {
                this.dialogFormVisibleEdit = false;
                this.$refs[formName].resetFields()
            }
        }
    }
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #304156;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
