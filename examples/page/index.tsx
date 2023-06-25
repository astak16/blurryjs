import styled from "styled-components";
// import Blur from "../../packages";
import Blur from "blurryjs-1";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Input,
  InputNumber,
  Radio,
  RadioChangeEvent,
  Space,
} from "antd";

export default () => {
  const [text] = useState<string>(() => generateRandomString(10));
  const [text2, setText2] = useState<string[]>([generateRandomString(10)]);
  const [radioValue, setRadioValue] = useState<string>("blur");
  const [sliderValue, setSliderValue] = useState(2);
  const [inputValue, setInputValue] = useState<string>("");

  const timerRef = useRef<number>();
  const timer2Ref = useRef<number>();
  const blurRef = useRef<Blur>();

  useEffect(() => {
    initTime();
    setTimeout(() => {
      clearInterval(timerRef.current);
    }, 10000);
    const blur = new Blur({
      blurryWords: ["a", "b", "罗大佑"],
      // autoBlur: true,
      // operator: "*",
      excludes: ["uccs"],
    });
    blurRef.current = blur;
    return () => {
      blur.destroy();
    };
  }, []);

  const initTime = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      const random = generateRandomString(10);
      setText2((text2) => {
        const newText = JSON.parse(JSON.stringify(text2));
        newText.push(random);
        return newText;
      });
    }, 1000);
  };

  const onClick = () => {
    const options = setOptions(radioValue);

    blurRef.current?.enableBlur(options);
  };
  const onClick2 = () => {
    blurRef.current?.disableBlur();
  };

  const onChangeRadio = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setRadioValue(value);

    const options = setOptions(value);

    blurRef.current?.enableBlur(options);
  };

  const onChangeNumber = (value: number | null) => {
    setSliderValue(value || 0);
    blurRef.current?.enableBlur({ blur: value || 0 });
  };

  const onChangeInput = (e: any) => {
    setInputValue(e.target.value);
  };

  const setOptions = (value: any) => {
    const isBlur = value === "blur";
    const a = {
      operator: isBlur ? undefined : value,
    };
    const b = {
      blur: isBlur ? sliderValue : 0,
    };
    const c = {
      blurryWords: inputValue.split(","),
    };
    return isBlur ? { ...b, ...c } : { ...a, ...c };
  };

  const onClickButton = () => {
    const options = setOptions(radioValue);
    blurRef.current?.enableBlur({ ...options });
  };

  return (
    <Rooted>
      <div>
        <Space>
          <Button onClick={onClick}>开启模糊</Button>
          <Button onClick={onClick2}>关闭模糊</Button>
        </Space>
        <div className="divider" />
        <Space>
          <div>文本处理：</div>
          <Radio.Group onChange={onChangeRadio} value={radioValue}>
            <Radio value={"*"}>*</Radio>
            <Radio value={"x"}>x</Radio>
            <Radio value={"blur"}>透明</Radio>
          </Radio.Group>
          {radioValue === "blur" && (
            <Space>
              <div className="uccs">透明度： {sliderValue}</div>
              <Col span={12}>
                <InputNumber
                  min={0}
                  max={10}
                  onChange={onChangeNumber}
                  value={sliderValue}
                />
              </Col>
            </Space>
          )}
        </Space>
        <div className="divider" />
        <Space>
          <Input onChange={onChangeInput} style={{ width: 220 }} />
          <Button style={{ width: 80 }} onClick={onClickButton}>
            模糊
          </Button>
        </Space>
        <div className="content">
          <div className="left__component">
            <div>千分位：11,111.2</div>
            <div className="divider" />
            <div>负数：-1,1111.2</div>
            <div className="divider" />
            <div>小数：-1.2</div>
            <div className="divider" />
            <div>整数：13294582</div>
            <div className="divider" />
            <div>随机字符串一：${text}</div>
            <div className="divider" />
            <div>随机字符串二：</div>
            <div style={{ fontSize: 20 }}>
              {text2.map((i) => (
                <div key={i}>
                  <span>{i}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="right__component">
            <p>
              不谈周杰伦，只谈罗大佑。很多人对罗大佑有误解，以为他只是靠人文关怀获得地位的才子，却忽略了他的音乐才能，却从来没想过，词写得好的创作者有很多，为何只有罗大佑的作品能跨越四十年的时光，横框两岸三地，传唱至今？
            </p>
            <br />
            <p>
              1.罗大佑风格的开创性在罗大佑之前的华语乐坛，大陆刚解除封闭状态没有多久，台湾的民歌运动如火如荼，比如侯德健，吴楚楚，胡德夫等一批唱作人都做出了不少优秀的作品，但基本以抒情的民谣为主，龙的传人也是如此，而罗大佑在第一张专辑里就做出了石破天惊的摇滚，布鲁斯和雷鬼，陶喆评价《之乎者也》”第一次听到如此中西合璧的歌曲，前奏的钟声加上雷鬼的节奏，批判性的歌词，让我汗毛竖立”，《将进酒》是罗大佑自己编曲，将西洋布鲁斯毫无痕迹地融为纯正的中国味道，《鹿港小镇》的电吉他也是非常经典的摇滚riff，起码在我目前的认知里，华语流行最早的摇滚，雷鬼和布鲁斯，都来自罗大佑，而且不是照搬，而是“中西合壁”，《错误》后段部分的编曲也是非常具有实验性的，灵动绵长的弦乐，迷幻味的键盘，律动十足的bassline，在现在来听也毫不过时。
            </p>
            <br />
            <p>
              2.罗大佑对旋律和歌词的开创性在罗大佑之前，台湾流行乐坛基本是以短句或者中短句歌词为主，比如吴楚楚的《你的歌》“:也许你愿意唱一首歌，轻轻柔柔的一首歌，一点点欢欣，一点点希望”《龙的传人》“遥远的东方有一条江，它的名字就叫长江，遥远的东方有一条河，它的名字就叫黄河“而从罗大佑开始，大量的长句歌词和旋律被创作出来，比如《光阴的故事》"春天的花开秋天的风以及冬天的落阳，忧郁的青春年少的我曾经无知的这么想”，再比如《童年》“福利社里面什么都有就是口袋里没有半毛钱，诸葛四郎和魔鬼党到底谁抢到那支宝剑”，不要觉得这种不算音乐上的开创，因为流行音乐最重要的不是单一的旋律也不是单一的歌词，更不是单一的编曲，而是词曲咬合，歌词长，在那个还没有开始重视律动的年代，对旋律的写作要求更高，创作难度上升了一个台阶，还有像歌词旋律的三段式写法，以及歌词中回文的运用，也是影响了许多像高晓松这一辈的民谣创作人。
            </p>
            <br />
            <p>
              1-2点，罗大佑在音乐创作上的贡献不亚于任何流行天王，其至犹有过之，比之鲍勃迪伦，罗大佑甚至更有音乐上的自觉性{" "}
            </p>
            <br />
            <p>
              3.风格多样性罗大佑的音乐风格其实非常多，当然他的根源在民谣和摇滚，这和鲍勃迪伦一样。就像周杰伦看起来风格很多变，但他的多变也都是基于R&B和HIP-HOP一样。民谣《童年》《光阴的故事》《乡愁四韵》等，地方民歌《船歌》，融合了凤阳花鼓节奉的《身后大道东》。闽南本土歌谣《青春舞曲2000》，在编曲里加入大量管乐和爵士钢琴，并且融入了摇滚和舞曲节奏的《青春舞曲》，雷鬼《之乎者也》，摇滚《鹿港小镇》《爱人同志》《长征》《阿辉饲了一只狗》等，还有像《火车》，《蓝》，《东风》，《长征》《时光在慢慢消失》《变天着花》等等，你会惊叹于罗大佑在旋律和编曲上的想象力和复杂程度，绝对不是很多跟风的所谓罗大佑歌迷和其他踩罗大佑的人能想象的。
            </p>
            <br />
            <p>
              4.配乐罗大佑也创作过不少电影配乐，为电影《衣锦还乡》担任配乐，获得第9届香港电影金像奖的最佳电影配乐奖，经典《船歌》即为主题曲，为电影《滚滚红尘》制作配乐，《滚滚红尘》这首主题曲大家也都耳熟能详，《双镯》的主题曲《似是故人来》获得第11届香港电影金像奖“最佳影片主题曲“奖，为《阿郎的故事》创作主题曲《你的样子》，和杜琪峰合作的《黑社会》同时提名了金像奖和金马奖的最佳配乐奖，除此以外还和杜琪峰合作了《华丽的上班族》，参与创作了《搭错车》原声大碟，作词作曲《是否》，作词《一样的月光》《酒干倘卖无》。还有两首仿莫扎特的古典小品，在音乐素养上，纵观华语流行乐坛，又有几个能和他并肩？
            </p>
            <br />
            <p>
              5.题材多样性乡愁的《光阴的故事》《乡愁四韵》《船歌》《故乡》等等，香港政治《皇后大道东》《亲亲表哥》，骂台湾领导的《阿辉饲了一只狗》，写给台湾过去，现在和未来的《鹿港小镇》《亚细亚的孤儿》和《未来的主人翁》，写小市民生活的《超级市民》，写社会现象批判的《现象七十二变》，写理想的《闪亮的日子》，写爱情的《野百合也有春天》《恋曲1990》等，写对大陆眷恋的《东方之珠》《将进酒》，写大爱的《明天会更好》一个台湾音乐人，在台湾写尽了给台湾的时代三部曲，到了香港后，创作的一系列音乐又成为香港和大陆立场关系的代表作品，横跨两岸三地，这等格局除了罗大佑还有谁能做到?
            </p>
            <br />
            <p>
              6.歌词罗大佑的歌词文学性和深度就是最顶尖的，有人说那我家那谁谁谁题材也很多，也有人文关怀，你罗大佑凭啥就牛逼?我看就是装逼，OK，我只举例子写政治:"道貌岸然挂在你的脸上满脸是装腔作势一表仁慈
              倚老卖老告诉大家你是可敬的忠贞不二爱国份子
              嘴里说的永远都是一套，做的事天地良心自己知道”-《现象七十二变》"这个漂亮朋友道别亦漂亮，夜夜电视荧幕继续旧形象，到了那日同庆个个要鼓堂，硬币上那尊容变烈士铜像，知己一声拜拜远去这都市，要靠伟大同志搞搞新意思，会有铁路城巴也会有的士，但是路线可能要问问何事”《皇后大道东》"每一次闭上了眼就想到了你,你象一句美丽的口号挥不去,在这批判斗争的世界里,每个人都要学习保护自己,让我相信你的忠贞,爱人同志.也许我不是爱情的好样板,怎么分也分不清左右还向前看."《爱人同志》写家国:"让海风吹拂了五千年，每一滴泪珠仿佛都说出你的尊严，让海潮伴我来保佑你，请别忘记我永远不变黄色的脸”《东方之珠》"潮来潮去，日落日出。黄河也变成了一条陌生的流水。江山如画，时光流转。秦时的明月汉时关。双手拥抱是一片国土的沉默。少年的我迷惑。摊开地图，
              飞出了一条龙。故园回首明月中。”《将进酒》写恋爱:"黑漆漆的孤枕边
              是你的温柔，醒来时的清晨里
              是我的哀愁，或许明日太阳西下倦鸟已归时，你将已经踏上旧时的归途，人生难得再次寻觅相知的伴侣，生命终究难舍蓝蓝的白云天”《恋曲1990》我爱你想你念你怨你深情永不变，难道你不曾口头想想昨目的誓言，就算你留恋开放在水中娇艳的水仙，却忘了寂寞的山谷里野百合也有春天。"《野百合也有春天》
            </p>
            <br />
            <p>
              7.传唱度/旋律优美程度罗大佑的经典歌曲数不胜数，写词有深度的不在少数，但是歌声能传遍华语世界，并且贯穿三代人，若不是旋律写得极好，实在没有其他理由。高晓松在《睡在我上铺的兄弟》有这么一句歌词“你刻在墙上的字依然清晰，从那时候起就没有人能擦去“这里的字，高晓松后来说就是罗大佑的歌词。《恋曲1990》让一个非洲黑人时隔二十年后泪流不止，想念起自己的母亲。例子就不一一举了，很多人说罗大佑现在没人听了，我给05后甚至10后的学生放《童年》《光阴的故事》《东方之珠》《明天会更好》，他们都非常熟悉这些旋律，可能由于年纪的原因，他们不可能再去粉一个年近70的老头子，但是音乐会永存。如果你对以上都不服，那么去听听《海上花》，大调五声音阶作曲，如此具有东方古典韵味的优美而天气的旋律，从第一秒就能融化在音符里，仿佛乘着海浪飘飘荡荡
              看见泡沫在阳光下浮现又破灭 这首歌的旋律美妙程度
              在我几万首的听歌数量 上千张中外专辑聆听史上
              也是毫无争议的第一，我觉得我这辈子，不会再听到比这更好听的歌了。
            </p>
            <br />
            <p>
              8.历史意义/地位在罗大佑之前的横空出世之前，12,321.2歌曲多是抒情伤感，轻圣和缓，而“歌至罗大佑，眼界始大，感慨遂深，遂变伶工之歌而为士大夫之歌”，原来歌曲除了讲爱情，讲回忆，还能表达愤怒，表达政治立场，还能抗争黑暗和丑恶，还能成为八十年代台湾文化运动的旗帜。通过罗大佑，我们听到《童年》这样永不褪色的童真回忆，能沉浸在《滚滚红尘》人生飘荡，爱恨无萍的千古情愁中，能为《乡愁四韵》《将进酒》这样的浓厚的家国情怀共鸣，能感受《变天着花》这样的诡谲而辛辣的讽刺，还会为《未来的主人翁》这样的预言感同身受。罗大佑是独属于中国的大师，好比日本的吉田拓郎，美国的鲍勃-迪伦，他们的作品记录了时代，随着时代的发展变化出不同的面貌，未来若干年有人来考古，能通过他们的歌曲考察到当年的时代风潮;但他们的歌又预言了时代，他们所唱过的故事，时至今日，仍然时时刻刻在发生。他们又是通俗化的，写爱，写恨，写情，写愁，细腻婉转，大气深情，他们还能站在个人的立场，关心着所有人关心的社会问题，股票，选举，战争，政治等等。在台湾流行音乐百大专辑中，《之乎者也》位列第一《未来的主人翁》位列第九，《家》第五十。而排第二的《搭错车》，排第四的《天天天蓝》，里面也全都是罗大佑(以及李寿全)的身影。陶喆评价罗大佑"他是教父，是我音乐路上的灯塔周杰伦评价罗大佑“我觉得罗大佑是个时代性的歌手。很少歌能流传超过三年的，但罗大佑的歌可以。做歌手就是要成为历史，成为一个时代的“代言人物”，让大家在想到这个时代的时候就想起他。我的目标就是像罗大佑一样成为一个时代的“音乐教父”。崔健评价”他是把歌曲从文学，旋律的组合上升到一个特别严肃和庄重的层面，他让流行音乐可以讨论历史，政治，甚至身世。他影响了很多人，很多人因为他拿起了吉他。他让人们觉得音乐是一种可以上不封顶的东西“”论坛关于历史地位的讨论永远不会停歇，然而伟大的音乐永存，灯塔也会永远照亮世间，不会因为一群跳梁小丑而褪色。
            </p>
          </div>
        </div>
      </div>
    </Rooted>
  );
};

function generateRandomString(length: number) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789,./-=!@#$";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

const Rooted = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: 100vh;
  .divider {
    height: 10px;
  }
  .row {
    display: flex;
  }
  .content {
    margin-top: 20px;
    height: 500px;
    overflow: hidden;
    display: flex;
    .left__component {
      width: 300px;
      flex-shrink: 0;
      overflow: scroll;
      height: 100%;
    }
    .right__component {
      flex: 1;
      overflow: scroll;
      height: 100%;
    }
  }
`;
