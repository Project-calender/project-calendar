# 📅 Google Calender Clone Project
Google calendar clone project

<br>

## 🖥 페이지 정보

### 사이트 주소 

#### - http://www.groupcalendars.shop/calendar

### 원본 사이트 주소

#### - https://calendar.google.com/calendar/u/0/r
<br>

## 🧬 프로젝트 정보

### 개발 기간
* 2022.07.01 ~ 2022.11.11

### 기술 스택

#### FRONT-END
* <img align="center" src="https://img.shields.io/badge/React-41BADB?style=flat-square&logo=react&logoColor=white" />

#### BACK-END 
* <img align="center" src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" />

#### DB
* <img align="center" src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white" /> 
* <img align="center" src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white" />
* <img align="center" src="https://img.shields.io/badge/Amazon S3-569A31?style=flat-square&logo=s3&logoColor=white" />

#### CLOUD
* <img align="center" src="https://img.shields.io/badge/Vultr-007BFC?style=flat-square&logo=vultr&logoColor=white" />

<br>

## 📝 프로젝트 기록

### api문서

* http://158.247.214.79/api-docs/#/

### 기능 명세서

* https://docs.google.com/spreadsheets/d/1AFXAvhII1ugEXLDN_P1gHsp2OkYb9ul8MHO_Ujjr61s/edit#gid=0

### erd 설계도

*  https://www.erdcloud.com/d/BwHZnBFnx537CJ2Kg

### git 전략

*  [git전략1](https://shared-spaghetti-774.notion.site/Commit-Message-Convention-f0939e3a810b4f21a70f81b50d3c5e6c)

*  [git전략2](https://shared-spaghetti-774.notion.site/PR-Convention-e76185a9f06341649e31033814b26ee3)

*  [git전략3](https://www.notion.so/Workflow-47705ebe076949bd95b5b3182e4b7792)

### front-back 요청 기록들

*  https://shared-spaghetti-774.notion.site/63c5a8c8228442929ea700de8f4e54c5

<br>

## 📚기능소개

* 로컬로그인 뿐만 아니라, 카카오,네이버,구글을 통한 소셜 로그인 가능 (passport.js 도입) 
  ![image](https://user-images.githubusercontent.com/77993709/201359576-f360a970-b875-4633-9aeb-10cd3a1fd8cf.png)

<br>

* 개인만의 캘린더, 또는 여러 사람들과 함께하는 그룹 캘린더를 통한 일정 기록 및 공유

![SE-d1d00b41-a65b-4927-a4b1-907d4dc7be30](https://user-images.githubusercontent.com/77993709/201386922-a2e39354-7401-48c0-b2aa-30a04cc3910b.png)

<br>


- 캘린더 생성

![SE-5d3c3a3d-63bf-493e-a6bd-480d01d0a4ba](https://user-images.githubusercontent.com/77993709/201387593-c8133e2d-9538-4515-9f5b-02e9a7eee7ef.png)

<br>


* 캘린더에 다른 사용자 초대


![SE-34026654-60c3-4ed2-87d9-f4e2e3dc54c3](https://user-images.githubusercontent.com/77993709/201387617-806f4984-c8c9-4b6d-ad1f-19307ca82aea.png)

<br>


* 초대를 받을 시, guest에게 알림 전송

![SE-5c6abb57-ce6d-465c-ac06-cb4ecb1f7fec](https://user-images.githubusercontent.com/77993709/201387635-86373a49-aae0-441a-b214-4da80fc5a3f0.png)


<br>


* 같은 달력에 있는 다른 사용자와 이벤트 공유 ( 참여 / 불참여 / 미정 으로 의사 표시 가능 )

![SE-ecde65df-81a5-4927-8ce1-69f89c63293d](https://user-images.githubusercontent.com/77993709/201387677-4ca7a8cf-f7d5-4c38-8ad6-090b06cc8120.png)

<br>

* socket을 통한 실시간 알림 구현

![SE-b5e5adfd-7ac2-4785-bb37-76dced55a6f5](https://user-images.githubusercontent.com/77993709/201387744-d7fd9e4b-d8ee-4d92-ad30-31997e976861.png)

<br>


* 이름을 통한 이벤트 검색 기능

![SE-b0165374-6e12-4ab2-a7f3-3838b3b7a7d2](https://user-images.githubusercontent.com/77993709/201387797-bdcee5a8-2048-414b-98ab-d0b2b8a9feb5.png)

<br>



* 특정 날짜 기준 이벤트 확인

![SE-8d5573ee-988b-4687-8f8a-ca52b54d74be](https://user-images.githubusercontent.com/77993709/201387810-81b1a3e3-9ee7-4ed2-8a6c-b0b461893472.png)

<br>



* 4일 기준 이벤트 확인

![SE-c71d6e6d-a0e6-4c28-b457-5de42436b8c6](https://user-images.githubusercontent.com/77993709/201387832-869d3f2a-7196-4bcc-ae6a-b9eabf0d70ee.png)

<br>



* 일주일 기준 이벤트 확인

![SE-cd82864f-95e3-49e2-afbe-88ba4cb86ef5](https://user-images.githubusercontent.com/77993709/201387844-5075a051-7ee5-44c1-8a5f-31e0cd2d82aa.png)

<br>


* 연도 별로 한눈에 일정 확인 

![SE-bef82dbd-c683-4512-81e2-79cd2cfab034](https://user-images.githubusercontent.com/77993709/201387863-eab3d3d6-d59b-40c0-81f5-118236779023.png)

