import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../common/types";

type MyAllClearReport = StackScreenProps<RootStackParamList, 'MyAllClearReport'>;

export default function UnreadPeoples(props: MyAllClearReport) {
    // params
    const {navigation} = props;
    const {messageId} = props.route.params;

    return(<></>)
}