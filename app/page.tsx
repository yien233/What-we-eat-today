'use client';

import { useMemo, useState } from 'react';
import {
  ChevronDown,
  Clock3,
  Dices,
  Search,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PwaInstall } from '@/app/pwa-install';

type Food = {
  name: string;
  category: string;
  price: number;
  emoji: string;
  spicy?: boolean;
};

const makeFoods = (
  category: string,
  emoji: string,
  entries: Array<[string, number, boolean?]>,
): Food[] =>
  entries.map(([name, price, spicy]) => ({ name, category, price, emoji, spicy }));

const foods: Food[] = [
  ...makeFoods('面条江湖', '🍜', [
    ['兰州牛肉面', 20], ['日式豚骨拉面', 32], ['重庆小面', 16, true],
    ['老北京炸酱面', 22], ['武汉热干面', 12], ['葱油拌面', 15],
    ['陕西油泼面', 18, true], ['厦门沙茶面', 25], ['海鲜炒面', 25],
    ['新疆过油肉拌面', 28],
  ]),
  ...makeFoods('米饭当家', '🍚', [
    ['黄焖鸡米饭', 22], ['隆江猪脚饭', 25], ['台式卤肉饭', 20],
    ['广式煲仔饭', 28], ['海南鸡饭', 25], ['叉烧滑蛋饭', 26],
    ['麻婆豆腐盖饭', 16, true], ['咖喱鸡肉饭', 22], ['扬州炒饭', 18],
    ['韩式石锅拌饭', 28, true],
  ]),
  ...makeFoods('粉汤饺子', '🥟', [
    ['柳州螺蛳粉', 18, true], ['桂林卤粉', 16], ['云南过桥米线', 24],
    ['重庆酸辣粉', 14, true], ['越南牛肉河粉', 28], ['干炒牛河', 25],
    ['扁食汤', 15], ['鲜肉馄饨', 16], ['东北水饺', 20], ['鲜肉锅贴', 18],
  ]),
  ...makeFoods('西式快餐', '🍔', [
    ['经典牛肉汉堡', 25], ['香辣鸡腿堡', 20, true], ['玛格丽特披萨', 28],
    ['培根芝士披萨', 32], ['金枪鱼三明治', 18], ['芝士火腿三明治', 16],
    ['美式热狗', 18], ['墨西哥鸡肉卷', 22, true], ['意式肉酱面', 28],
    ['奶油培根意面', 30],
  ]),
  ...makeFoods('街头小吃', '🥙', [
    ['西安肉夹馍', 15], ['山东杂粮煎饼', 10], ['天津煎饼果子', 12],
    ['台湾手抓饼', 12], ['鸡蛋灌饼', 10], ['上海生煎包', 15],
    ['南翔小笼包', 18], ['广式肠粉', 15], ['福州肉燕', 18], ['东北烤冷面', 12, true],
  ]),
  ...makeFoods('一锅热乎', '🍲', [
    ['麻辣烫', 25, true], ['川味冒菜', 28, true], ['便利店关东煮', 18],
    ['乐山钵钵鸡', 25, true], ['砂锅米线', 20], ['番茄肥牛锅', 30],
    ['韩式部队锅', 32, true], ['日式寿喜锅', 35], ['酸菜鱼小锅', 30, true],
    ['潮汕砂锅粥', 28],
  ]),
  ...makeFoods('轻食简餐', '🥗', [
    ['凯撒鸡肉沙拉', 25], ['藜麦鸡胸饭', 28], ['全麦鸡肉卷', 20],
    ['紫菜包饭', 18], ['什锦寿司', 28], ['鸡蛋蔬菜三明治', 15],
    ['皮蛋瘦肉粥', 15], ['番茄鸡蛋面', 16], ['蒸蛋肉末套餐', 22],
    ['烤蔬菜鹰嘴豆碗', 26],
  ]),
  ...makeFoods('异国风味', '🌮', [
    ['日式亲子丼', 26], ['日式牛肉盖饭', 28], ['韩式炸酱面', 24],
    ['泰式炒河粉', 28, true], ['冬阴功汤粉', 30, true], ['越南鸡肉法棍', 22],
    ['印度咖喱烤饼', 30, true], ['新加坡叻沙', 32, true], ['土耳其烤肉卷', 25],
    ['墨西哥玉米饼', 28, true],
  ]),
];

const categories = ['全部', ...Array.from(new Set(foods.map((food) => food.category)))];
const budgets = [20, 30, 0];

export default function Home() {
  const [category, setCategory] = useState('全部');
  const [budget, setBudget] = useState(30);
  const [result, setResult] = useState<Food>(() => foods.find((food) => food.name === '厦门沙茶面') ?? foods[0]);
  const [history, setHistory] = useState<Food[]>([]);
  const [rolling, setRolling] = useState(false);
  const [burst, setBurst] = useState(0);
  const [showPool, setShowPool] = useState(false);
  const [query, setQuery] = useState('');

  const pool = useMemo(
    () => foods.filter((food) =>
      (category === '全部' || food.category === category) &&
      (budget === 0 || food.price <= budget),
    ),
    [category, budget],
  );

  const visibleFoods = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return keyword
      ? foods.filter((food) => `${food.name}${food.category}`.toLowerCase().includes(keyword))
      : foods;
  }, [query]);

  const draw = () => {
    if (rolling || pool.length === 0) return;
    setRolling(true);

    let turns = 0;
    const ticker = window.setInterval(() => {
      setResult(pool[Math.floor(Math.random() * pool.length)]);
      turns += 1;
      if (turns >= 11) {
        window.clearInterval(ticker);
        const alternatives = pool.length > 1 ? pool.filter((food) => food.name !== result.name) : pool;
        const winner = alternatives[Math.floor(Math.random() * alternatives.length)];
        setResult(winner);
        setHistory((previous) => [winner, ...previous.filter((food) => food.name !== winner.name)].slice(0, 3));
        setBurst((value) => value + 1);
        setRolling(false);
      }
    }, 70);
  };

  return (
    <main className="site-shell">
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="吃点啥首页">
          <span className="brand-mark"><UtensilsCrossed /></span>
          <span>吃点啥</span>
        </a>
        <div className="today-stamp">
          <span>今日菜单</span>
          <strong>{new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' }).format(new Date())}</strong>
        </div>
        <div className="top-actions">
          <PwaInstall />
          <Button variant="outline" onClick={() => setShowPool((value) => !value)} className="menu-button">
            菜单库 · {foods.length}
            <ChevronDown className={showPool ? 'rotate-180' : ''} />
          </Button>
        </div>
      </header>

      <section id="top" className="decision-stage" aria-labelledby="page-title">
        <div className="intro-copy">
          <Badge className="eyebrow"><Sparkles /> 选择困难急救站</Badge>
          <h1 id="page-title">今天，<br /><em>吃点啥？</em></h1>
          <p>别再把时间耗在菜单上。选好范围，交给一点点运气。</p>
          <div className="menu-note" aria-label="食物库信息">
            <span>{foods.length}</span>
            <p><strong>种平价选择</strong><br />从街头小吃到异国风味</p>
          </div>
        </div>

        <div className="draw-panel">
          <div className="panel-label">
            <span>YOUR PICK / 今日签</span>
            <span>NO. {String((foods.indexOf(result) + 1)).padStart(2, '0')}</span>
          </div>

          <div key={burst} className={`result-card ${rolling ? 'is-rolling' : 'is-revealed'}`} aria-live="polite">
            <div className="confetti" aria-hidden="true">
              {Array.from({ length: 10 }).map((_, index) => <i key={index} />)}
            </div>
            <span className="food-emoji" aria-hidden="true">{result.emoji}</span>
            <div>
              <p className="result-kicker">命运觉得你该吃</p>
              <h2>{result.name}</h2>
              <div className="result-meta">
                <span>{result.category}</span>
                <span>约 ¥{result.price}</span>
                {result.spicy && <span className="spicy">辣</span>}
              </div>
            </div>
          </div>

          <div className="filters" aria-label="抽取条件">
            <div className="filter-row">
              <span className="filter-title">想吃哪类</span>
              <div className="chip-list">
                {categories.map((item) => (
                  <button key={item} type="button" className={category === item ? 'chip active' : 'chip'} onClick={() => setCategory(item)} aria-pressed={category === item}>
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-row compact">
              <span className="filter-title">人均预算</span>
              <div className="chip-list">
                {budgets.map((value) => (
                  <button key={value} type="button" className={budget === value ? 'chip active' : 'chip'} onClick={() => setBudget(value)} aria-pressed={budget === value}>
                    {value === 0 ? '不限' : `¥${value} 内`}
                  </button>
                ))}
              </div>
              <span className="pool-count">当前可抽 {pool.length} 种</span>
            </div>
          </div>

          <Button onClick={draw} disabled={rolling || pool.length === 0} className="draw-button">
            <Dices />
            {rolling ? '正在翻菜单…' : '就决定是它！'}
          </Button>
          <p className="shortcut">按一下，让今天的饭有着落</p>
        </div>

        <aside className="history-card">
          <div className="history-title"><Clock3 /> 刚刚抽到</div>
          {history.length > 0 ? (
            <ol>
              {history.map((food, index) => (
                <li key={food.name}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{food.name}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p>第一顿饭，<br />正等你来抽。</p>
          )}
          <span className="good-appetite">BON APPÉTIT!</span>
        </aside>
      </section>

      <figure className="visual-strip">
        <img
          src="/og.png"
          width="1664"
          height="936"
          loading="lazy"
          alt="面条、汉堡、披萨、饺子、三明治和米饭组成的今日菜单海报"
        />
        <figcaption>
          <span>随便吃，也要认真吃</span>
          <strong>80 种平价美味，只推荐类型，不推荐店铺。</strong>
        </figcaption>
      </figure>

      {showPool && (
        <section className="food-pool" aria-labelledby="pool-title">
          <div className="pool-heading">
            <div>
              <span className="section-index">02 / 菜单库</span>
              <h2 id="pool-title">八十种，慢慢挑</h2>
            </div>
            <label className="search-box">
              <Search />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜一道想吃的…" aria-label="搜索食物" />
            </label>
          </div>
          <div className="food-grid">
            {visibleFoods.map((food, index) => (
              <button
                key={food.name}
                type="button"
                className="food-item"
                onClick={() => {
                  setResult(food);
                  setHistory((previous) => [food, ...previous.filter((item) => item.name !== food.name)].slice(0, 3));
                  setBurst((value) => value + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span className="food-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="food-list-emoji">{food.emoji}</span>
                <span className="food-name">{food.name}</span>
                <span className="food-price">¥{food.price}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <footer>
        <span>吃点啥 · 让选择轻一点</span>
        <span>收录 {foods.length} 种平价即食美味</span>
      </footer>
    </main>
  );
}
