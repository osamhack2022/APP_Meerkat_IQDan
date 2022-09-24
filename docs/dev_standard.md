# 개발 규칙
## 칸반 규칙 (할일 정리)
~~ClickUp 칸반을 14일 Free-trial로 사용중입니다. 이후에는 해커톤 종료일까지 팀장이 사비로 구매할 예정입니다.~~
해당 리포 내에 Projects에서 칸반 정리를 하기로 했습니다. 모든 티켓들은 이슈화를해서 자동으로 고유번호가 매겨지게할 것입니다. 예시로 #4번이 부여되면 관련 커밋은
MK-4로 작성하시면됩니다. 티켓(이슈)은 완료 후 archive처리하고 close issue를 해주어야합니다. [CLI에서 close issue하는 법](https://stackoverflow.com/questions/1687262/link-to-the-issue-number-on-github-within-a-commit-message).
#### 왜 칸반을 쓰는지
누가 무슨일을 하고 있고 앞으로 무슨일을 해야되는지 실시간을 관리하기 위함입니다. 그리고 커밋 관리도 편해집니다.
#### 티켓이란?
- 할일 하나 당 티켓(이슈) 하나입니다.
- 나중에 commit 기록 검색하는것 보다 티켓으로 커밋 기록 관리하는게 편합니다. 깃헙 프로젝트에 현재 자동으로 할일 마다 티켓 번호 (이슈 번호)가 매겨지기 때문에 그대로 쓰면됩니다. (i.e. git commit -m "MK-22 fix: fix something") +모든 커밋에 티켓 번호가 있어야하는 것은 아닙니다.
- 자기가 뭔가 할일이 생각날 때 마다 미완료 티켓에 티켓 추가하고 진행중인 것은 진행중인 티켓으로
옮긴 후 자신에게 assign하면됩니다.
- 꼭 하나의 티켓 당 하나의 커밋일 필요는 없습니다. 아예 커밋이 없는 티켓도 많이 있을 예정이고, 하나의 티켓에 여러개의 커밋이 있을수도 있습니다.

## Git 규칙
#### Branch 생성 규칙
- 그냥 main에 푸시하지 않고 Branch를 쓰는 이유는 Pull Request 때문입니다.
- Pull Request가 중요하지 않다면 자기가 직접 merge하고, 중요할 경우 모두를 초대하여 Pull Request를 보도록 합니다.
- Branch 이름은 `seho/fe` `exqt/be` `hyelie/be-user` `dongjin/fe-navbar` 와 같은 이름을 권장합니다.
#### Commit 메시지 규칙
- Commit에는 알맞은 헤더를 사용합니다. 
- 간결하면서도 이해가 가능하게 작성합니다.
- 한글/영어 모두 허용되어 있습니다만 헤더는 꼭 영어로 작성해주시기 바랍니다.
- 새로운 헤더 사용시 아래에 추가해주시기 바랍니다.
- 보통의 경우엔 ClickUp과 연동된 티켓 번호를 사용합니다. => ClickUp에 초대되어야 칸반을 볼 수 있습니다. ClickUp 사용방식은 면대면으로 이세호가 알려줄 것.
- 티켓 번호까지 붙이면 commit -m "MK-302 fix: fixed some issues" 이런식으로 헤더 앞에 티켓 고유번호가 붙게됨.


| 헤더  | 의미  | 메시지 예시 |
|---|---|---|
| fix  | 각종 버그 수정  | fix: fixed logo sticking out from top navbar in mobile |
| feat | 새로운 기능 추가  | feat: added page skeleton for user login |
| BREAKING CHANGE  | config 혹은 기능적으로 큰 변화가 있는 커밋 | BREAKING CHANGE: Calendar 컴포넌트를 다른 것으로 바꾸었습니다!|
| docs  | 개발 문서 수정  | docs: minor fix in the backend readme |
| config  | 개발 혹은 빌드 config 변경 | config: changed gitignore config to rule out more files|
| test | test 관련 추가, 변경, 삭제 | - |
| etc | 태그 달기 애매한 각종 사례들 | etc: added toy files to check git commands |

참고: https://www.conventionalcommits.org/en/v1.0.0/

#### Commit 충돌 해결
main의 안전을 위해 각자 branch에서 프로젝트를 수정합시다.
```
git checkout -b seho/fe # 세호 프런트엔드 브랜치 생성 후 그 브랜치 사용
```
commit 시에는 기본적으로 stash와 rebase를 사용합니다. 자주 commit 해주어야 서로 충돌이 많이 안납니다.
아래는 commit 충돌 해결법입니다. 익숙해질 때까지 모든 push 전에는 아래와 같은 절차를 밟아주시기 바랍니다.
git merge 대신 git rebase를 사용하는 이유는 git log가 더 깔끔해지기 때문입니다. [차이점 링크](https://stackoverflow.com/questions/804115/when-do-you-use-git-rebase-instead-of-git-merge).
```
git add .
git stash # 내가 변경한 사항 모두 stash에 저장
git fetch origin # 리모트에서 여태까지 새로운 변경사항 가져오기
git rebase -i origin # 리모트에서 사람들이 한 커밋 가져오기
git stash pop # stash에서 저장사항 뽑아오기.
git rebase --continue # 인터랙티브 충돌 해결 후 continue하여 rebase 끝날 때까지 반복.
git push # 자신의 remote branch에 푸시 (이후 github.com에서 풀리퀘 생성)
```
- 이렇게 다른 사람들이 바꿔놓은 change가 모두 반영이 되고 그 위에 자신의 commit이 덮어씌워집니다. 그 다음에 rebasing 충돌을 파일 마다 들어가서 해결해주면 됩니다.
- 이제 Pull Request를 git 홈페이지의 자신의 브랜치로 가서 생성합니다. 
- 생성 후 중요한 사항이 아니라면 merge합니다.
- **Git Lens 사용시 ctrl+shift+p => GitLens: Disable Interactive Rebase Editor을 실행해줍니다. Interactive Rebase Editor에 현재 문제가 있는 것으로 보여집니다.**

