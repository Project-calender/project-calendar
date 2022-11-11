# 📅 Google Calender Clone Project

### 사이트 주소 

#### - http://www.groupcalendars.shop/calendar

### 원본 사이트 주소

#### - https://calendar.google.com/calendar/u/0/r

### api문서

#### - http://158.247.214.79/api-docs/#/

### 기능 명세서

#### - https://docs.google.com/spreadsheets/d/1AFXAvhII1ugEXLDN_P1gHsp2OkYb9ul8MHO_Ujjr61s/edit#gid=0

### erd 설계도

#### - https://www.erdcloud.com/d/BwHZnBFnx537CJ2Kg

### git 전략

#### - [git전략1](https://shared-spaghetti-774.notion.site/Commit-Message-Convention-f0939e3a810b4f21a70f81b50d3c5e6c)

#### - [git전략2](https://shared-spaghetti-774.notion.site/PR-Convention-e76185a9f06341649e31033814b26ee3)

#### - [git전략3](https://www.notion.so/Workflow-47705ebe076949bd95b5b3182e4b7792)

### front-back 요청 기록들

#### - https://shared-spaghetti-774.notion.site/63c5a8c8228442929ea700de8f4e54c5



## 📚기능소개



#### - 로그인 구현

* 로컬로그인 뿐만 아니라, 카카오,네이버,구글을 통한 소셜 로그인 가능 (passport.js 도입)
  ![image](https://user-images.githubusercontent.com/77993709/201359576-f360a970-b875-4633-9aeb-10cd3a1fd8cf.png)

<br>

* 개인만의 캘린더, 또는 여러 사람들과 함께하는 그룹 캘린더를 통한 일정 기록 및 공유



![SE-d1d00b41-a65b-4927-a4b1-907d4dc7be30](C:\Users\USER\Downloads\SE-d1d00b41-a65b-4927-a4b1-907d4dc7be30.png)

<br>



- 캘린더 생성
  ![화면 캡처 2022-11-12 000636](https://user-images.githubusercontent.com/77993709/201381112-d0cba07d-d0e6-4095-b4c5-f0d385a20cc8.png)

<br>



* 캘린더에 다른 사용자 초대

![화면 캡처 2022-11-12 001213](https://user-images.githubusercontent.com/77993709/201381261-08cbd1a8-b401-444e-ae33-f9ef6b8841b3.png)

<br>



* 초대를 받을 시, guest에게 알림 전송

![화면 캡처 2022-11-12 003443](https://user-images.githubusercontent.com/77993709/201381405-7afb6655-4656-4a15-8375-6cf80204cd95.png)

<br>



* 같은 달력에 있는 다른 사용자와 이벤트 공유 ( 참여 / 불참여 / 미정 으로 의사 표시 가능 )

![화면 캡처 2022-11-12 001256](https://user-images.githubusercontent.com/77993709/201381315-89030b40-0c4b-42cf-bf03-bd6d28fc9999.png)

<br>



* 이름을 통한 이벤트 검색 기능

![화면 캡처 2022-11-12 003215](https://user-images.githubusercontent.com/77993709/201381546-0321092d-7fbb-4cad-85a6-77fe8bcd90f1.png)

<br>



* 특정 날짜 기준 이벤트 확인

![화면 캡처 2022-11-12 003622](https://user-images.githubusercontent.com/77993709/201381660-ea1ea48b-2106-46ef-ba58-226ed0cc983f.png)

<br>



* 4일 기준 이벤트 확인

![화면 캡처 2022-11-12 003708](https://user-images.githubusercontent.com/77993709/201381596-30ba0405-d60b-4e4a-beda-a3ea2738af48.png)

<br>



* 일주일 기준 이벤트 확인

![화면 캡처 2022-11-12 003636](https://user-images.githubusercontent.com/77993709/201381583-b5e3a621-5e98-4656-bb78-79bed7bc4f10.png)

<br>



* 연도 별로 한눈에 일정 확인 

![화면 캡처 2022-11-12 003244](https://user-images.githubusercontent.com/77993709/201381624-92062c5c-3f03-4f71-abfe-85209dfdb459.png)
