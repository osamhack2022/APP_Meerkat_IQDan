import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import FriendsRoute from '@routes/friends.route';
import ChatRoomRoute from '@routes/chatRoom.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(),new FriendsRoute(), new ChatRoomRoute()]);

app.start();
