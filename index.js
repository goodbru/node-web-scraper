const fs = require('fs');

var cheerioAdv = require('cheerio-advanced-selectors');
var cheerio = cheerioAdv.wrap(require('cheerio'));
var request = require('request');
var URL = 'http://substack.net'

request((URL + '/images/'), function (error, response, body) {
  if (!error && response.statusCode == 200) {
        $ = cheerio.load(body);
         var rows = [];
         $('tr').each(function(i,elem) {
            
            var type = $('td a', elem).text().slice($('td a', elem).text().indexOf('.') + 1)
            
            rows.push({
              "Permission": $('td code', elem).first().text(),
              "Path": URL + $('td a', elem).attr('href'),
              "Filetype": type
            });
         });


          var convert = ConvertToCSV(JSON.stringify(rows))
                  console.log(convert);

          fs.writeFile("images.csv", convert, function(err) {
              if(err) {
                  return console.log(err);
              }
                  console.log("The file was saved!");
          });
  }


         function ConvertToCSV(objArray) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';

            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '') line += ','

                    line += array[i][index];
                }

                str += line + '\r\n';
            }

            return str;
        }
});


// rows.pipe(fs.createWriteStream('images.csv')

