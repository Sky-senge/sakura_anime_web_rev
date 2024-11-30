import { ElMessage } from 'element-plus';
import request from './request';
import { useUserStore } from '@/stores/counter';

const queryPlaceDetails = async (page: any) => {
  try {
    const response = await request.get('/details', {
      params: {
        page
      }
    });
    if (response.status === 200) {
      return response.data;
    } else {
      ElMessage.error('获取参数失败！');
      throw new Error('Failed to fetch data');
    }
  } catch (error) {
    ElMessage.error('获取参数失败！');
    throw error;
  }
};

const queryCommentList = async (page: any) => {
  try {
    const response = await request.get('/getComments', {
      params: {
        page
      }
    });
    if (response.status === 200) {
      return response.data;
    } else {
      if(response.status===404){
        return null;
      }
      ElMessage.error('获取参数失败！');
      throw new Error('Failed to fetch data');
    }
  } catch (error) {
    throw error;
  }
};

const postComment = async (page: any, requestBody: Object) => {
  try {
    const response = await request.post('/postComment', {
      page: page,
      ...requestBody
    });
    return response.data;
  } catch (error) {
    console.error('Error posting comment:', error);
    throw error;
  }
};

const queryIndexCard = async()=>{
  try{
    const response = await request.get('/indexData')
    return response.data
  }catch(error){
    console.error('Error with Get IndexData:',error)
  }
};

const querySideData = async () => {
  try {
    const response = await request.get('/sideData');
    return response.data;
  } catch (error) {
    console.error('Error with Get SideData:', error);
  }
};

// interface LoginInput { //接口，定义LoginInput的内容(V1)
//   name: string;
//   passwd: string;
//   phone:string;
// }

interface UserInput{
  username:string;
  password:string;
  phone:string;
}
const loginQuery= async (inputData:UserInput) =>{
  try{
    let loginData={username:"",password:""} //临时数据
    loginData.username=inputData.username
    loginData.password=inputData.password
    const response=await request.post('/login',{
      ...loginData
    });
    loginData={username:"",password:""} //Clear Data
    return response.data
  }catch(error){
    console.error("Login Falid:",error)
  }
};

const signupQuery= async (inputData:UserInput) =>{
  try{
    let signupData={
      user:{
        username:inputData.username,
        password:inputData.password,
        phone:inputData.phone,
        role:"USER",
        nickname:inputData.username,
        email:null,
        avatar:null,
        remarks:null
      }
    }
    const response=await request.post('/newUser',{
      ...signupData
    });
    return response.data
  }catch(error){
    console.error("Signup Falid:",error)
  }
  
}

const getCurrentUser = async () => {
  const userStore = useUserStore();
  const payload = {
    Operator: userStore.username,
    Token: userStore.token,
  };
  try {
    const response = await request.post('/getCurrentUser', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
};

const getSelfComments = async (username:string)=>{
  const response=await request.get('/getSelfComments',{
    params:{
      uname:username
    }
  });
  if(response.status===200){
    return response.data;
  }else{
    console.error('Failed to get User Comments,is No Comments?');
    return null;
  }
  
}

export { queryPlaceDetails,queryCommentList,postComment,queryIndexCard,querySideData,loginQuery,signupQuery,getCurrentUser,getSelfComments };
