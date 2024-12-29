import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts';

interface HistoricalData {
    id: number;
    date: string;
    lastTransactionPrice: number;
    maxPrice: number;
    minPrice: number;
    averagePrice: number;
    percentageChange: number;
    quantity: number;
    turnoverBest: number;
    totalTurnover: number;
}

interface ChartData {
    date: string;
    price: number;
    volume: number;
    sma20: number | null;
    sma50: number | null;
    sma200: number | null;
    ema20: number | null;
    ema50: number | null;
    rsi: number | null;
    stochasticK: number | null;
    stochasticD: number | null;
    macdLine: number | null;
    macdSignal: number | null;
    macdHistogram: number | null;
    williamsR: number | null;
    roc: number | null;
}

interface TechnicalIndicators {
    sma20: number | null;
    sma50: number | null;
    sma200: number | null;
    ema20: number | null;
    ema50: number | null;
    rsi: number | null;
    stochasticK: number | null;
    stochasticD: number | null;
    macdLine: number | null;
    macdSignal: number | null;
    macdHistogram: number | null;
    williamsR: number | null;
    roc: number | null;
}

interface Props {
    historicalData: HistoricalData[];
    selectedCompany: string;
}

type TimeFrame = 'daily' | 'weekly' | 'monthly';

const TechnicalAnalysis: React.FC<Props> = ({ historicalData, selectedCompany }) => {
    const [timeframe, setTimeframe] = useState<TimeFrame>('daily');
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicators>({
        sma20: null,
        sma50: null,
        sma200: null,
        ema20: null,
        ema50: null,
        rsi: null,
        stochasticK: null,
        stochasticD: null,
        macdLine: null,
        macdSignal: null,
        macdHistogram: null,
        williamsR: null,
        roc: null
    });
    const [loading, setLoading] = useState<boolean>(true);

    // Group data by timeframe
    const groupDataByTimeframe = (data: HistoricalData[]): HistoricalData[] => {
        if (timeframe === 'daily') return data;

        return data.reduce((acc: HistoricalData[], curr) => {
            const date = new Date(curr.date);
            let periodStart: Date;

            if (timeframe === 'weekly') {
                periodStart = new Date(date);
                periodStart.setDate(date.getDate() - date.getDay());
            } else { // monthly
                periodStart = new Date(date.getFullYear(), date.getMonth(), 1);
            }

            const periodKey = periodStart.toISOString();
            const existingPeriod = acc.find(item => new Date(item.date).toISOString() === periodKey);

            if (existingPeriod) {
                existingPeriod.maxPrice = Math.max(existingPeriod.maxPrice, curr.maxPrice);
                existingPeriod.minPrice = Math.min(existingPeriod.minPrice, curr.minPrice);
                existingPeriod.averagePrice = (existingPeriod.averagePrice + curr.averagePrice) / 2;
                existingPeriod.quantity += curr.quantity;
                existingPeriod.turnoverBest += curr.turnoverBest;
                existingPeriod.totalTurnover += curr.totalTurnover;
            } else {
                acc.push({
                    ...curr,
                    date: periodStart.toISOString()
                });
            }

            return acc;
        }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    // Calculate SMA
    const calculateSMA = (prices: number[], period: number): (number | null)[] => {
        return prices.map((_, index) => {
            if (index < period - 1) return null;
            const sum = prices.slice(index - period + 1, index + 1).reduce((a, b) => a + b, 0);
            return sum / period;
        });
    };

    // Calculate EMA
    const calculateEMA = (prices: number[], period: number): number[] => {
        const multiplier = 2 / (period + 1);
        const ema = [prices[0]];

        for (let i = 1; i < prices.length; i++) {
            ema.push((prices[i] * multiplier) + (ema[i - 1] * (1 - multiplier)));
        }
        return ema;
    };

    // Calculate RSI
    const calculateRSI = (prices: number[], period: number = 14): (number | null)[] => {
        const changes = prices.map((value, index) =>
            index === 0 ? 0 : value - prices[index - 1]
        );

        const gains = changes.map(change => change > 0 ? change : 0);
        const losses = changes.map(change => change < 0 ? -change : 0);

        const rsi = Array(period).fill(null);

        for (let i = period; i < prices.length; i++) {
            const avgGain = gains.slice(i - period, i).reduce((sum, gain) => sum + gain, 0) / period;
            const avgLoss = losses.slice(i - period, i).reduce((sum, loss) => sum + loss, 0) / period;

            if (avgLoss === 0) {
                rsi.push(100);
            } else {
                const rs = avgGain / avgLoss;
                rsi.push(100 - (100 / (1 + rs)));
            }
        }

        return rsi;
    };

    // Calculate Stochastic Oscillator
    const calculateStochastic = (data: HistoricalData[], period: number = 14): { k: number[], d: number[] } => {
        const k = data.map((_, index) => {
            if (index < period - 1) return 0;

            const periodData = data.slice(index - period + 1, index + 1);
            const high = Math.max(...periodData.map(d => d.maxPrice));
            const low = Math.min(...periodData.map(d => d.minPrice));
            const current = data[index].averagePrice;

            return ((current - low) / (high - low)) * 100;
        });

        const d = calculateSMA(k, 3) as number[];
        return { k, d };
    };

    // Calculate MACD
    const calculateMACD = (prices: number[]): { line: number[], signal: number[], histogram: number[] } => {
        const ema12 = calculateEMA(prices, 12);
        const ema26 = calculateEMA(prices, 26);
        const macdLine = ema12.map((value, index) => value - ema26[index]);
        const signalLine = calculateEMA(macdLine, 9);
        const histogram = macdLine.map((value, index) => value - signalLine[index]);

        return { line: macdLine, signal: signalLine, histogram };
    };

    // Calculate Williams %R
    const calculateWilliamsR = (data: HistoricalData[], period: number = 14): number[] => {
        return data.map((_, index) => {
            if (index < period - 1) return 0;

            const periodData = data.slice(index - period + 1, index + 1);
            const high = Math.max(...periodData.map(d => d.maxPrice));
            const low = Math.min(...periodData.map(d => d.minPrice));
            const current = data[index].averagePrice;

            return ((high - current) / (high - low)) * -100;
        });
    };

    // Calculate Rate of Change (ROC)
    const calculateROC = (prices: number[], period: number = 12): number[] => {
        return prices.map((price, index) => {
            if (index < period) return 0;
            const previousPrice = prices[index - period];
            return ((price - previousPrice) / previousPrice) * 100;
        });
    };

    // Get trading signal
    const getTradingSignal = (): string => {
        let buySignals = 0;
        let sellSignals = 0;

        // Moving Averages Signals
        if (technicalIndicators.sma20 && technicalIndicators.sma50) {
            if (technicalIndicators.sma20 > technicalIndicators.sma50) buySignals++;
            else sellSignals++;
        }

        if (technicalIndicators.ema20 && technicalIndicators.ema50) {
            if (technicalIndicators.ema20 > technicalIndicators.ema50) buySignals++;
            else sellSignals++;
        }

        // RSI Signals
        if (technicalIndicators.rsi) {
            if (technicalIndicators.rsi > 70) sellSignals++;
            else if (technicalIndicators.rsi < 30) buySignals++;
        }

        // Stochastic Signals
        if (technicalIndicators.stochasticK && technicalIndicators.stochasticD) {
            if (technicalIndicators.stochasticK > 80) sellSignals++;
            else if (technicalIndicators.stochasticK < 20) buySignals++;
        }

        // MACD Signal
        if (technicalIndicators.macdLine && technicalIndicators.macdSignal) {
            if (technicalIndicators.macdLine > technicalIndicators.macdSignal) buySignals++;
            else sellSignals++;
        }

        // Make final decision
        if (buySignals > sellSignals + 1) return 'BUY';
        if (sellSignals > buySignals + 1) return 'SELL';
        return 'HOLD';
    };

    useEffect(() => {
        if (historicalData && historicalData.length > 0) {
            const timeframeData = groupDataByTimeframe(historicalData);
            const prices = timeframeData.map(d => d.averagePrice);

            // Calculate all technical indicators
            const sma20 = calculateSMA(prices, 20);
            const sma50 = calculateSMA(prices, 50);
            const sma200 = calculateSMA(prices, 200);
            const ema20 = calculateEMA(prices, 20);
            const ema50 = calculateEMA(prices, 50);
            const rsi = calculateRSI(prices);
            const stochastic = calculateStochastic(timeframeData);
            const macd = calculateMACD(prices);
            const williamsR = calculateWilliamsR(timeframeData);
            const roc = calculateROC(prices);

            // Update technical indicators
            setTechnicalIndicators({
                sma20: sma20[sma20.length - 1],
                sma50: sma50[sma50.length - 1],
                sma200: sma200[sma200.length - 1],
                ema20: ema20[ema20.length - 1],
                ema50: ema50[ema50.length - 1],
                rsi: rsi[rsi.length - 1],
                stochasticK: stochastic.k[stochastic.k.length - 1],
                stochasticD: stochastic.d[stochastic.d.length - 1],
                macdLine: macd.line[macd.line.length - 1],
                macdSignal: macd.signal[macd.signal.length - 1],
                macdHistogram: macd.histogram[macd.histogram.length - 1],
                williamsR: williamsR[williamsR.length - 1],
                roc: roc[roc.length - 1]
            });

            // Prepare chart data
            const newChartData: ChartData[] = timeframeData.map((item, index) => ({
                date: new Date(item.date).toLocaleDateString(),
                price: item.averagePrice,
                volume: item.quantity,
                sma20: sma20[index],
                sma50: sma50[index],
                sma200: sma200[index],
                ema20: ema20[index],
                ema50: ema50[index],
                rsi: rsi[index],
                stochasticK: stochastic.k[index],
                stochasticD: stochastic.d[index],
                macdLine: macd.line[index],
                macdSignal: macd.signal[index],
                macdHistogram: macd.histogram[index],
                williamsR: williamsR[index],
                roc: roc[index]
            }));

            setChartData(newChartData);
            setLoading(false);
        }
    }, [historicalData, timeframe]);

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    const tradingSignal = getTradingSignal();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-900">
                Technical Analysis for {selectedCompany}
            </h2>

            {/* Timeframe Selection */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => setTimeframe('daily')}
                    className={`px-4 py-2 rounded ${timeframe === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Daily
                </button>
                <button
                    onClick={() => setTimeframe('weekly')}
                    className={`px-4 py-2 rounded ${timeframe === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Weekly
                </button>
                <button
                    onClick={() => setTimeframe('monthly')}
                    className={`px-4 py-2 rounded ${timeframe === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Monthly
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-black">
                {/* Moving Averages Card */}
                <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="font-semibold text-black">Moving Averages</h3>
                    <div className="mt-2 space-y-2">
                        <p>SMA 20: {technicalIndicators.sma20?.toFixed(2)}</p>
                        <p>SMA 50: {technicalIndicators.sma50?.toFixed(2)}</p>
                        <p>SMA 200: {technicalIndicators.sma200?.toFixed(2)}</p>
                        <p>EMA 20: {technicalIndicators.ema20?.toFixed(2)}</p>
                        <p>EMA 50: {technicalIndicators.ema50?.toFixed(2)}</p>
                    </div>
                </div>

                {/* Oscillators Card */}
                <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="font-semibold text-black">Oscillators</h3>
                    <div className="mt-2 space-y-2">
                        <div>
                            <p>RSI (14): {technicalIndicators.rsi?.toFixed(2)}</p>
                            <p className={`text-sm ${
                                technicalIndicators.rsi && technicalIndicators.rsi > 70 ? 'text-red-600' :
                                    technicalIndicators.rsi && technicalIndicators.rsi < 30 ? 'text-green-600' :
                                        'text-black'
                            }`}>
                                {technicalIndicators.rsi && technicalIndicators.rsi > 70 ? 'Overbought' :
                                    technicalIndicators.rsi && technicalIndicators.rsi < 30 ? 'Oversold' :
                                        'Neutral'}
                            </p>
                        </div>
                        <div>
                            <p>Stochastic %K: {technicalIndicators.stochasticK?.toFixed(2)}</p>
                            <p>Stochastic %D: {technicalIndicators.stochasticD?.toFixed(2)}</p>
                        </div>
                        <div>
                            <p>MACD Line: {technicalIndicators.macdLine?.toFixed(2)}</p>
                            <p>Signal Line: {technicalIndicators.macdSignal?.toFixed(2)}</p>
                            <p>Histogram: {technicalIndicators.macdHistogram?.toFixed(2)}</p>
                        </div>
                        <div>
                            <p>Williams %R: {technicalIndicators.williamsR?.toFixed(2)}</p>
                            <p>ROC: {technicalIndicators.roc?.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Trading Signal Card */}
                <div className="p-4 bg-white rounded-lg shadow text-black">
                    <h3 className="font-semibold text-black">Trading Signal</h3>
                    <div className="mt-2">
                        <p className={`text-lg font-bold ${
                            tradingSignal === 'BUY' ? 'text-green-600' :
                                tradingSignal === 'SELL' ? 'text-red-600' :
                                    'text-yellow-600'
                        }`}>
                            {tradingSignal}
                        </p>
                    </div>
                </div>
            </div>

            {/* Price Chart */}
            <div className="h-96 w-full bg-white rounded-lg shadow p-4">
                <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="price" stroke="#8884d8" name="Price" />
                        <Line type="monotone" dataKey="sma20" stroke="#82ca9d" name="SMA 20" />
                        <Line type="monotone" dataKey="sma50" stroke="#ff7300" name="SMA 50" />
                        <Line type="monotone" dataKey="sma200" stroke="#413ea0" name="SMA 200" />
                        <Line type="monotone" dataKey="ema20" stroke="#8dd1e1" name="EMA 20" />
                        <Line type="monotone" dataKey="ema50" stroke="#a4de6c" name="EMA 50" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Oscillators Chart */}
            <div className="h-72 w-full bg-white rounded-lg shadow p-4">
                <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="rsi" stroke="#8884d8" name="RSI" />
                        <Line type="monotone" dataKey="stochasticK" stroke="#82ca9d" name="Stochastic %K" />
                        <Line type="monotone" dataKey="stochasticD" stroke="#ff7300" name="Stochastic %D" />
                        <Line type="monotone" dataKey="williamsR" stroke="#413ea0" name="Williams %R" />
                        <Line type="monotone" dataKey="roc" stroke="#8dd1e1" name="ROC" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* MACD Chart */}
            <div className="h-72 w-full bg-white rounded-lg shadow p-4">
                <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="macdLine" stroke="#8884d8" name="MACD" />
                        <Line type="monotone" dataKey="macdSignal" stroke="#82ca9d" name="Signal" />
                        <Bar dataKey="macdHistogram" fill="#413ea0" name="Histogram" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Volume Chart */}
            <div className="h-48 w-full bg-white rounded-lg shadow p-4">
                <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="volume" fill="#8884d8" name="Volume" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TechnicalAnalysis;