import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../common/types";

type ReportAllClear = StackScreenProps<RootStackParamList, 'ReportAllClear'>;

export default function UnreadPeoples(props: ReportAllClear) {
    // params
    const {navigation} = props;
    const {messageId} = props.route.params;

    return(<></>)
}