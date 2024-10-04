# 웹소켓 게임 만들기

### 내일배움캠프 6기

---

### 1. 프로젝트 구성

1. src/

- app.js: 서버 실행파일

- constants.js: 실행 가능한 버전 확인

- redisClient.js: 레디스 연결용 파일

2. src/handlers

- game.handle.js: 게임의 실행과 종료

- handlerMapping.js: 각 핸들러로 보내는 좌표

- helper.js: regiser.handler.js를 도와주는 파일이자 서버 접속, 해제, 등 soket.io관리포함

- highscore.handler.js: 최고점일 경우 발생되는 이벤트 관리

- item.handler.js: 아이템 획득 및 획득 점수 관리

- laststage.handler.js: 최종 스테이지에서 일정 점수(1300점)마다 점수 검증

- regiser.handler.js: 메인 soket.io파일로 각 socket에서 보내주는 event 및 helper.js를 관리

- stage.handler.js: 스테이지 변경 및 기본 점수 유효성 검증

3. src/init

- assets.js: 서버 실행 시 불러올 json파일 관리

- socket.js: 서버 실행 시 regiser.handler.js로 socket.io를 보내는 파일

4. src/models

- item.model.js: 아이템 획득 관리를 위한 공간

- stage.model.js: 스테이지 관리를 위한 공간

- user.model.js: 유저 관리를 위한 공간

5. public(중요한 부분만)

- index.js: html에 연결될 메인 파일(대부분의 파일과 연동)

- Score.js: 점수 관리 파일

- Socket.js: socket.io 이벤트를 위한 파일

- 그외: 아이템 생성, 속도, 캐릭터 등 관리 파일

6. assets

- item_unlock.js: 스테이지별 아이템 언록 데이터

- item.js: 아이템 별 점수 데이터

- stage.js: 스테이지별 점수획득 및 스테이지 변경 점수 데이터

---

### 2. 프로젝트 기능

1. 게임 진행은 spacebar하나로 가능(점프)

2. 각 스테이지별로 시간당 주어지는 점수가 다름

- score.js의 update 참조

- item.json 참조

3. 각 스테이지별로 생성되는 아이템이 다름

- ItemController.js의 createItem 참조

- item_unlock.json 참조

4. 각 스테이지는 일정 점수마다 구분됨

- score.js의 update 참조

- stage.json 참조

5. 아이템 획득 시 마다, 스테이지 변경될 때 마다

- score.js의 update 참조

- stage.handler, item.handler 참조

6. 최종 스테이지 도달 이후 일정 점수마다 검증 작업

- laststage.handler 참조

7. 유저는 레디스를 이용해 관리

- user.model.js와 regiser.handler.js 참조

8. 게임 종료(오버) 시 최종점수를 highscore와 비교해 totalhighscore를 넘어서면 브로드캐스트 및 레디스에 값 바꾸기

- score.js의 setHighScore()참조

- Socket.js의 socket.on('highScoreSet') 참조

- highscore.handler.js 참조

### 3. 주의사항

1. 최종 스테이지 도달 이후 1300점이라는 임의 상수로 지정되어있음

- Score.js의 verify 변수, laststage.handler.js의 maxboundary 변수
