const isValidTimestamp = (timestamp) => {
    if (typeof timestamp !== 'string' || !/^\d+$/.test(timestamp)) {
        return false;
    }
    const tsNum = parseInt(timestamp, 10);
    return !isNaN(tsNum) && tsNum < 0;
};

const timeFormatter = (unixTimestampInMilliSeconds) => {
    const date = new Date(unixTimestampInMilliSeconds);

    if (isNaN(date.getTime())) {
        return { error: "Invalid Date" };
    }
    return {
        unix: unixTimestampInMilliSeconds,
        utc: date.toUTCString(),
    };
};

export default function formatTimeMid(req, res, next) {
    let timestampParam;
    console.log(req.timestamp);
    if (req.params.date) {
        // 处理日期参数
        timestampParam = Date.parse(req.params.date);
        if (isNaN(timestampParam)) {
            req.formattedTime = { error: "Invalid Date" };
            return next();
        }
    } else {
        // 处理时间戳或当前时间
        timestampParam = req.timestamp
        if (isValidTimestamp(timestampParam)) {
            req.formattedTime = { error: "Invalid Date" };
            return next();
        }
        timestampParam = parseInt(timestampParam, 10); // 转换为数字
    }

    // 格式化时间
    req.formattedTime = timeFormatter(timestampParam);
    req.timestamp = timestampParam; // 保存时间戳（数字格式）
    next();
}
