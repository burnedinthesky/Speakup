import { Modal } from "@mantine/core";

interface ReputationExpModalProps {
    opened: boolean;
    setOpened: (val: boolean) => void;
}

const ReputationExpModal = ({ opened, setOpened }: ReputationExpModalProps) => {
    const styles = {
        h2: "mt-8 text-xl text-primary-800",
        h3: "mt-2 text-lg text-primary-800",
        p: "mt-2 text-sm text-neutral-700",
    };

    return (
        <Modal
            opened={opened}
            onClose={() => {
                setOpened(false);
            }}
            title="什麼是聲望"
            size="lg"
        >
            <p className={styles.p}>
                平台聲望就是Speakup的經驗值。你可以透過積極的與Speakup上其他使用者互動增加你的聲望。聲望可以讓你搶先體驗Speakup的功能，累積到一定程度之後也可以申請成為倡議家，發表自己想探討的時事議題！
            </p>
            <h2 className={styles.h2}>聲望怎麼獲得？</h2>
            <p className={styles.p}>
                聲望可以透過積極的參與討論或是創作議題獲得，但也會因為不符合使用者規範的行為而減少。
            </p>
            <h3 className={styles.h3}>積極參與討論</h3>
            <ul className="list-disc pl-3">
                <li className={styles.p}>發表論點或回覆其他使用者的論點</li>
                <li className={styles.p}>留言獲得其他使用者的認同</li>
                <li className={styles.p}>論點有很大的討論價值</li>
            </ul>
            <h3 className={styles.h3}>創作你有興趣的議題</h3>
            <ul className="list-disc pl-3">
                <li className={styles.p}>統整社會事件來撰寫議題</li>
                <li className={styles.p}>議題吸引多人參與討論</li>
            </ul>

            <h2 className={styles.h2}>聲望會減少嗎？</h2>
            <p className={styles.p}>
                如果使用者有不符合Speakup社群規範的行為，那麼他的聲望也會被扣取
            </p>
            <h3 className={styles.h3}>惡意進行討論</h3>
            <ul className="list-disc pl-3">
                <li className={styles.p}>在討論中惡意針對/攻擊其他使用者</li>
                <li className={styles.p}>在討論中散播假訊息</li>
                <li className={styles.p}>
                    在討論中發表不相關的訊息（例：廣告）
                </li>
            </ul>
            <h3 className={styles.h3}>用議題誤導其他使用者</h3>
            <ul className="list-disc pl-3">
                <li className={styles.p}>在議題中惡意散播假訊息</li>
                <li className={styles.p}>議題明顯嚴重偏頗某一立場</li>
            </ul>

            <h2 className={styles.h2}>聲望有什麼好處？</h2>
            <h3 className={styles.h3}>展現你的活躍程度吧</h3>
            <p className={styles.p}>
                利用留言、回覆、創作議題所的到的聲望可使你在留言時的留言排序更高，並且隨著聲望越高顏色也象徵階級越高，使你在留言區更加special
            </p>
            {/* <h3 className={styles.h3}>創作者階級</h3>
            <p className={styles.p}>
                達到1000聲望後可以選擇成為創作者，而當中又分為新手創作者與資深創作者，雖然同為創作者但其在權限上仍有不同差異，達到新手創作者後可利用議題所得的聲望來升級，當達到2500聲望時可申請為資深創作者，但要注意，成為創作者後留言仍然能得到聲望但並不影響在創作者這方面的升級喔，若利用議題獲得了15000聲望，那恭喜你你將是留言區、創作者中最高階閃耀的那位！
            </p> */}
        </Modal>
    );
};

export default ReputationExpModal;
