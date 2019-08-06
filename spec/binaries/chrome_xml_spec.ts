import * as path from 'path';
import {ChromeXml} from '../../lib/binaries/chrome_xml';
import { chromeXmlMock } from './chrome_xml_mock';
import * as xml2js from 'xml2js';

class ChromeXmlMock extends ChromeXml {
  getXml() {
    let retResult;
    xml2js.parseString(chromeXmlMock, (err, result) => {
      retResult = result;
    });
    return Promise.resolve(retResult);
  }
}

describe('chrome xml reader', () => {
  let out_dir = path.resolve('selenium_test');
  let chromeXml: ChromeXml;
  
  beforeEach(() => {
    chromeXml = new ChromeXmlMock();
  })

  it('should get a list', (done) => {
    chromeXml.out_dir = out_dir;
    chromeXml.ostype = 'Darwin';
    chromeXml.osarch = 'x64';
    chromeXml.getVersionList().then(list => {
      for (let item of list) {
        expect(item).toContain('/chromedriver_mac');
      }
      done();
    });
  });

  it('should get the 2.27, 64-bit version (arch = x64)', (done) => {
    chromeXml.out_dir = out_dir;
    chromeXml.ostype = 'Darwin';
    chromeXml.osarch = 'x64';
    chromeXml.getUrl('2.27').then(binaryUrl => {
      expect(binaryUrl.url).toContain('2.27/chromedriver_mac64.zip');
      done();
    });
  });

  it('should get the 2.27, 64-bit version (arch = x86)', (done) => {
    chromeXml.out_dir = out_dir;
    chromeXml.ostype = 'Darwin';
    chromeXml.osarch = 'x86';
    chromeXml.getUrl('2.27').then(binaryUrl => {
      expect(binaryUrl.url).toEqual('');
      done();
    });
  });

  it('should get the 2.20, 32-bit version (arch = x64)', (done) => {
    chromeXml.out_dir = out_dir;
    chromeXml.ostype = 'Darwin';
    chromeXml.osarch = 'x64';
    chromeXml.getUrl('2.20').then(binaryUrl => {
      expect(binaryUrl.url).toContain('2.20/chromedriver_mac32.zip');
      done();
    });
  });

  it('should get the 2.20, 32-bit version (arch = x86)', (done) => {
    chromeXml.out_dir = out_dir;
    chromeXml.ostype = 'Darwin';
    chromeXml.osarch = 'x86';
    chromeXml.getUrl('2.20').then((binaryUrl) => {
      expect(binaryUrl.url).toContain('2.20/chromedriver_mac32.zip');
      done();
    });
  });

  it('should get latest version', (done) => {
    chromeXml.out_dir = out_dir;
    chromeXml.ostype = 'Windows_NT';
    chromeXml.osarch = 'x64';
    chromeXml.getUrl('latest').then((binaryUrl) => {
      expect(binaryUrl.url).toContain('76.0.3809.68/chromedriver_win32.zip');
      done();
    });
  });
});
