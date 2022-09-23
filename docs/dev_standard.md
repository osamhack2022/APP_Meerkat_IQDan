# 개발 규칙
## Commit 규칙
- Commit에는 알맞은 헤더를 사용합니다. 
- 간결하면서도 이해가 가능하게 작성합니다.
- 한글/영어 모두 허용되어 있습니다만 헤더는 꼭 영어로 작성해주시기 바랍니다.
- 새로운 헤더 사용시 아래에 추가해주시기 바랍니다.

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

## Commit 방식
#### Pull Request를 보내기
기본적으로 stash와 rebase를 사용합니다.
```
git add . 
git stash
git fetch origin
git rebase -i origin <현재 로컬 브랜치 이름>
git stash pop
```
이렇게 다른 사람들이 바꿔놓은 change가 모두 반영이 되고 그 위에 자신의 commit이 덮어씌워집니다.
그 다음에 
