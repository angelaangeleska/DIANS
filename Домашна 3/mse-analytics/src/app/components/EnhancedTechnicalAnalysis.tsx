import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

interface Props {
    historicalData: HistoricalData[];
    selectedCompany: string;
}

const EnhancedTechnicalAnalysis: React.FC<Props> = ({ historicalData, selectedCompany }) => {
    const [technicalIndicators, setTechnicalIndicators] = useState<{
        lastPrice?: number;
        sma20?: number;
        sma50?: number;
        ema20?: number;
        ema50?: number;
        rsi?: number;
    }>({});
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Calculate SMA
    const calculateSMA = (data: number[], period: number): (number | null)[] => {
        const sma = [];
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) {
                sma.push(null);
                continue;
            }

            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += data[i - j];
            }
            sma.push(sum / period);
        }
        return sma;
    };

    // Calculate EMA
    const calculateEMA = (data: number[], period: number): number[] => {
        const k = 2 / (period + 1);
        const ema = [data[0]];

        for (let i = 1; i < data.length; i++) {
            ema.push(data[i] * k + ema[i - 1] * (1 - k));
        }
        return ema;
    };

    // Calculate RSI
    const calculateRSI = (data: number[], period = 14): (number | null)[] => {
        const rsi = [];
        const gains = [];
        const losses = [];

        for (let i = 1; i < data.length; i++) {
            const change = data[i] - data[i - 1];
            gains.push(change > 0 ? change : 0);
            losses.push(change < 0 ? -change : 0);
        }

        for (let i = 0; i < data.length; i++) {
            if (i < period) {
                rsi.push(null);
                continue;
            }

            const avgGain = gains.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
            const avgLoss = losses.slice(i - period, i).reduce((a, b) => a + b, 0) / period;

            if (avgLoss === 0) {
                rsi.push(100);
            } else {
                const rs = avgGain / avgLoss;
                rsi.push(100 - (100 / (1 + rs)));
            }
        }

        return rsi;
    };

    useEffect(() => {
        if (historicalData && historicalData.length > 0) {
            const prices = historicalData.map(d => d.averagePrice);

            // Calculate technical indicators
            const sma20 = calculateSMA(prices, 20);
            const sma50 = calculateSMA(prices, 50);
            const ema20 = calculateEMA(prices, 20);
            const ema50 = calculateEMA(prices, 50);
            const rsi = calculateRSI(prices);

            // Prepare chart data
            const newChartData = historicalData.map((item, index) => ({
                date: new Date(item.date).toLocaleDateString(),
                price: item.averagePrice,
                sma20: sma20[index],
                sma50: sma50[index],
                ema20: ema20[index],
                ema50: ema50[index],
                rsi: rsi[index]
            }));

            setChartData(newChartData);
            setTechnicalIndicators({
                lastPrice: prices[prices.length - 1],
                sma20: sma20[sma20.length - 1] as number,
                sma50: sma50[sma50.length - 1] as number,
                ema20: ema20[ema20.length - 1],
                ema50: ema50[ema50.length - 1],
                rsi: rsi[rsi.length - 1] as number
            });

            setLoading(false);
        }
    }, [historicalData]);

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Technical Analysis for {selectedCompany}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Indicator Cards */}
                <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="font-semibold">Moving Averages</h3>
                    <div className="mt-2 space-y-2">
                        <p>SMA 20: {technicalIndicators.sma20?.toFixed(2)}</p>
                        <p>SMA 50: {technicalIndicators.sma50?.toFixed(2)}</p>
                        <p>EMA 20: {technicalIndicators.ema20?.toFixed(2)}</p>
                        <p>EMA 50: {technicalIndicators.ema50?.toFixed(2)}</p>
                    </div>
                </div>

                <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="font-semibold">RSI</h3>
                    <p className="mt-2">{technicalIndicators.rsi?.toFixed(2)}</p>
                    <div className="mt-2 p-2 rounded">
                        {technicalIndicators.rsi && (
                            <p className={`text-sm ${
                                technicalIndicators.rsi > 70 ? 'text-red-600' :
                                    technicalIndicators.rsi < 30 ? 'text-green-600' :
                                        'text-gray-600'
                            }`}>
                                {technicalIndicators.rsi > 70 ? 'Overbought' :
                                    technicalIndicators.rsi < 30 ? 'Oversold' : 'Neutral'}
                            </p>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="font-semibold">Trading Signals</h3>
                    <div className="mt-2">
                        {technicalIndicators.ema20 && technicalIndicators.ema50 && (
                            <p className={`p-2 rounded ${
                                technicalIndicators.ema20 > technicalIndicators.ema50
                                    ? 'text-green-600'
                                    : 'text-red-600'
                            }`}>
                                {technicalIndicators.ema20 > technicalIndicators.ema50
                                    ? 'Bullish Signal'
                                    : 'Bearish Signal'}
                            </p>
                        )}
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
                        <Line type="monotone" dataKey="ema20" stroke="#8dd1e1" name="EMA 20" />
                        <Line type="monotone" dataKey="ema50" stroke="#a4de6c" name="EMA 50" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default EnhancedTechnicalAnalysis;