// app.js

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Firebase 初始化
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 註冊新用戶
function registerNewUser() {
  const email = "user@example.com";
  const password = "password";

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // 用戶已成功註冊
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // 註冊過程中出現錯誤
      console.log(errorMessage);
      console.log(errorCode);
    });
}

// 登入用戶
function loginUser() {
  const loginEmail = "user@example.com";
  const loginPassword = "password";

  signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    .then((userCredential) => {
      // 用戶已成功登入
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // 登入過程中出現錯誤
      console.log(errorMessage);
      console.log(errorCode);
    });
}

let form;
let submitButton;

if (document.getElementById('loginFormContainer')) {
    form = document.getElementById('loginForm');
    submitButton = document.getElementById('login_submit');
} else if (document.getElementById('registerFormContainer')) {
    form = document.getElementById('registerForm');
    submitButton = document.getElementById('register_submit');
}

if (form && submitButton) {
    submitButton.addEventListener('click', function(event) {
        event.preventDefault(); // 防止表單提交的默認行為
        // 在這裡處理表單的提交
        if (form.id === 'loginForm') {
            // 處理登入表單的提交
            loginUser();
        } else if (form.id === 'registerForm') {
            // 處理註冊表單的提交
            registerNewUser();
        }
    });
}

