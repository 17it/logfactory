module.exports = function (time, timeFormat) {
                if (typeof time==='number') {
                        time = new Date(time * 1000);
                } else if (typeof time==='string') {
                        time = new Date(Date.parse(time.replace(/-/g, '/')));
                }

                var t = {};
                t.YYYY = time.getFullYear();
                t.m = time.getMonth() + 1;
                t.D = time.getDate();
                t.H = time.getHours();
                t.M = time.getMinutes();
                t.S = time.getSeconds();
                t.mm = t.m>9 ? t.m : '0'+t.m;
                t.DD = t.D>9 ? t.D : '0'+t.D;
                t.HH = t.H>9 ? t.H : '0'+t.H;
                t.MM = t.M>9 ? t.M : '0'+t.M;
                t.SS = t.S>9 ? t.S : '0'+t.S;

                return timeFormat.replace(/\b[YmDHMS]+\b/g, function ($0) {
                        return t[$0] || '';
                });
        };
