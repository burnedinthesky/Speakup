import Head from "next/head";

import Header from "../../components/AppShell/Header";
import Navbar from "../../components/AppShell/Navbar";
import Footbar from "../../components/AppShell/Footbar";

const Reputation = () => {
    const data = {
        reputation: {
            comments: 0,
        },
    };

    const styles = {
        h2: "mt-8 text-xl text-primary-800",
        h3: "mt-2 text-lg text-primary-800",
        p: "mt-2 text-sm text-neutral-700",
    };

    const AppShell = () => {
        return (
            <>
                <Head>
                    <title>{`Speakup - 聲望`}</title>
                    <meta
                        name="viewport"
                        content="initial-scale=1.0, width=device-width"
                    />
                    <link rel="manifest" href="/site.webmanifest" />
                </Head>
                <Header />
                <Navbar retractable={false} />
                <Footbar />
            </>
        );
    };

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 overflow-y-auto bg-neutral-50 lg:bg-neutral-100">
            <AppShell />
            <div className="flex w-full flex-col items-center pt-14 pb-12 lg:ml-64 lg:w-[calc(100%-16rem)]">
                <div className="mt-10 flex w-[calc(100%-72px)] max-w-3xl flex-col bg-neutral-50 pb-20 md:w-[calc(100%-160px)] lg:mb-12 lg:px-12 lg:pb-8">
                    <h2 className={styles.h2}>什麼是聲望？</h2>
                    <p className={styles.p}>
                        平台聲望就是Speakup的經驗值。你可以透過積極的參與Speakup增加你的聲望。聲望可以讓你搶先體驗Speakup的功能，累積到一定程度之後也可以申請成為創作者，發表自己想探討的時事議題！
                    </p>
                    <h2 className={styles.h2}>聲望怎麼獲得？</h2>
                    <p className={styles.p}>
                        聲望可以透過積極的參與討論或是創作議題獲得，但也會因為不符合使用者規範的行為而減少。
                    </p>
                    <h3 className={styles.h3}>積極參與討論</h3>
                    <ul className="list-disc pl-3">
                        <li className={styles.p}>
                            每留一則留言+50聲望（每天至多200）
                        </li>
                        <li className={styles.p}>留言被按讚一次+5點聲望</li>
                        <li className={styles.p}>留言被按支持一次+10點聲望</li>
                        <li className={styles.p}>留言被撤銷一次-300點聲望</li>
                    </ul>
                    <h3 className={styles.h3}>創作你有興趣的議題</h3>
                    <ul className="list-disc pl-3">
                        <li className={styles.p}>每撰寫一篇議題可+500點聲望</li>
                        <li className={styles.p}>
                            參與討論的使用者{">"}200人+300點聲望
                        </li>
                    </ul>

                    <h2 className={styles.h2}>聲望有什麼好處？</h2>
                    <h3 className={styles.h3}>展現你的活躍程度吧</h3>
                    <p className={styles.p}>
                        利用留言、回覆、創作議題所的到的聲望可使你在留言時的留言排序更高，並且隨著聲望越高顏色也象徵階級越高，使你在留言區更加special，以下是個顏色階級所需聲望之列表：
                    </p>
                    <h3 className={styles.h3}>創作者階級</h3>
                    <p className={styles.p}>
                        達到1000聲望後可以選擇成為創作者，而當中又分為新手創作者與資深創作者，雖然同為創作者但其在權限上仍有不同差異，達到新手創作者後可利用議題所得的聲望來升級，當達到2500聲望時可申請為資深創作者，但要注意，成為創作者後留言仍然能得到聲望但並不影響在創作者這方面的升級喔，若利用議題獲得了15000聲望，那恭喜你你將是留言區、創作者中最高階閃耀的那位！
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Reputation;
