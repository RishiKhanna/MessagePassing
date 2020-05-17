console.log('Decrytor Script Initiated...');
alert('Welcome to Kibana Logs Decryptor Chrome Extension!! \n\nClick within the highlighted area of toggle buttons for decryption');

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting == "hello") {

            const EVENT_LISTENER = {
                CLICK: 'click',
                WHEEL: 'wheel'
            }

            const POST_URL = 'https://hzsvc-dataprotectui-q-c.hzn-svc.use1.sqa.aws.asurion.net/dataprotect/ui/decrypt/v1/submit';

            const HTML_ELEMENTS = {
                TABLE_CLASS: '.kbn-table.table',
                ARROW_BTN_WITH_TAG: 'button.kbnDocTableOpen__button',
                INNER_ARROW_BTN_WITH_TAG: 'span.kuiIcon.fa-caret-down',
                ARROW_BTN: 'kbnDocTableOpen__button',
                INNER_ARROW_BTN: 'kuiIcon fa-caret-down',
                SPAN: 'tr>td:nth-child(3) span',
                KIBANA_LOGO_CLASS: '.kbnGlobalNav__logo',
                TABLE_COLUMNS: '.kbnDocTableCell__dataField>div>span',
                TABLE_DATA: 'td',
                HOVER_BUTTONS_CLASS: 'fa kbnDocTableRowFilterButton',
                DECRYPTOR_BUTTON_ID: 'decryptorBtn'
            };

            const ENCRYPTION_KEY = 'awskms:aes';

            function changeBackgroundOfToggleButtons() {
                document.querySelectorAll(HTML_ELEMENTS.ARROW_BTN_WITH_TAG).forEach(htmlElement => {
                    !(htmlElement.style.backgroundColor === UTIL.string.COLOR.CYAN) && (htmlElement.style.backgroundColor = UTIL.string.COLOR.CYAN);
                });
            }

            changeBackgroundOfToggleButtons();
            document.addEventListener(EVENT_LISTENER.WHEEL, changeBackgroundOfToggleButtons, { capture: false, passive: true });

            function paraDecrypt(span, tableType) {
                const REGEX = /(?<=\>)(awskms.*?)(?=\<)/g;
                let arr = [...span.textContent.matchAll(REGEX)];
                for (let i = 0; i < arr.length; i++) {
                    const postData = new UTIL.string.CreateHTTPObject(POST_URL, UTIL.string.HTTP_METHODS.POST, arr[i][0]);
                    postData.fetchDecryptedData(function(data) {
                        console.log(span, data);
                        span.innerText = span.innerText.replace(arr[i][0], data);
                    });
                }
                span.style.color = UTIL.string.COLOR.RED;
                removeDecryptButton(span, tableType);
            }

            function statementDecrypt(span, tableType) {
                const postData = new UTIL.string.CreateHTTPObject(POST_URL, UTIL.string.HTTP_METHODS.POST, span.textContent);
                postData.fetchDecryptedData(function(data) {
                    if (data.startsWith('"awskms:aes')) {
                        let postDataRenewed = Object.create(postData);
                        postDataRenewed.body = data.substring(1, data.length - 1);
                        postDataRenewed.fetchDecryptedData(function(data) {
                            console.log(span, data);
                            span.innerText = data;
                        });
                    }
                    console.log(span, data);
                    afterFetch(span, data, UTIL.string.COLOR);
                });
                removeDecryptButton(span, tableType);
            }

            function removeDecryptButton(span, tableType) {
                //row button removal || col button removal
                if (tableType === 'row') {
                    span.parentElement.parentElement.nextSibling.remove();
                } else if (tableType === 'column') {
                    span.parentElement.nextSibling.firstChild.remove();
                }
            }

            function addDecryptorButtonWithListener(propertiesOfHTMLElementToBeAdded, position, existingKibanaHTMLElement, decryptFunc) {
                const decryptBtnForColumns = new UTIL.string.KibanaElement(propertiesOfHTMLElementToBeAdded);
                decryptBtnForColumns.createElement().
                insertElementAdjacentTo(existingKibanaHTMLElement, position).
                attachListener(undefined, decryptFunc);
            }

            function decryptColumns() {
                const kibanaTableColumns = document.querySelectorAll(HTML_ELEMENTS.TABLE_COLUMNS);
                let decryptFunc;
                kibanaTableColumns.forEach(kibanaColumn => {
                    (kibanaColumn.textContent.startsWith(ENCRYPTION_KEY) && (decryptFunc = statementDecrypt.bind(this, kibanaColumn, 'column')) ||
                        kibanaColumn.textContent.includes(ENCRYPTION_KEY) && (decryptFunc = paraDecrypt.bind(this, kibanaColumn, 'column'))) &&
                    !(kibanaColumn.parentElement.nextSibling.firstChild.id === HTML_ELEMENTS.DECRYPTOR_BUTTON_ID) &&
                    addDecryptorButtonWithListener({ type: 'button', text: '*', id: HTML_ELEMENTS.DECRYPTOR_BUTTON_ID, className: HTML_ELEMENTS.HOVER_BUTTONS_CLASS }, UTIL.string.ELEMENT_POSITION.AFTER_BEGIN, kibanaColumn.parentElement.nextSibling, decryptFunc);
                });
            }

            decryptColumns();
            document.addEventListener(EVENT_LISTENER.WHEEL, decryptColumns, { capture: false, passive: true });

            function decryptRows() {
                const logs_table = document.querySelector(HTML_ELEMENTS.TABLE_CLASS);
                logs_table && logs_table.addEventListener('click', function(event) {

                    const { target: clickableArea } = event;
                    if (!clickableArea === HTML_ELEMENTS.ARROW_BTN_WITH_TAG && !clickableArea === HTML_ELEMENTS.INNER_ARROW_BTN_WITH_TAG && !clickableArea === 'span.kuiIcon.fa-caret-right') {
                        return console.log('Click within highlighted arrow button for Decryption');
                    }

                    let dataRow;
                    let toggle = false;

                    switch (clickableArea.className) {
                        case HTML_ELEMENTS.ARROW_BTN:
                            toggle = clickableArea.ariaExpanded;
                            if (toggle === 'true') {
                                dataRow = clickableArea.parentElement.parentElement.nextSibling;
                            }
                            break;
                        case HTML_ELEMENTS.INNER_ARROW_BTN:
                            toggle = clickableArea.parentNode.ariaExpanded;
                            if (toggle === 'true') {
                                dataRow = clickableArea.parentElement.parentElement.parentElement.nextSibling;
                            }
                            break;
                    }

                    console.log('Toggling Buttons', toggle);

                    if (!dataRow) return;

                    const spanArr = dataRow.querySelectorAll(HTML_ELEMENTS.SPAN);
                    spanArr.forEach(span => {
                        let { innerText: encryptedText } = span;
                        const ENCRYPTION_KEY = 'awskms:aes';
                        let decryptFunc;

                        (encryptedText.startsWith(ENCRYPTION_KEY) && (decryptFunc = statementDecrypt.bind(this, span, 'row')) ||
                            encryptedText.includes(ENCRYPTION_KEY) && (decryptFunc = paraDecrypt.bind(this, span, 'row'))) &&
                        !(span.parentElement.parentElement.nextSibling.id === HTML_ELEMENTS.DECRYPTOR_BUTTON_ID) &&
                        addDecryptorButtonWithListener({ type: 'button', text: '*', id: HTML_ELEMENTS.DECRYPTOR_BUTTON_ID }, UTIL.string.ELEMENT_POSITION.AFTER_END, span.parentElement.parentElement, decryptFunc);

                    });
                });
            }

            decryptRows();

            const targetNode = document.querySelector('.dscResults');
            const observer = new MutationObserver(function() {
                if (targetNode.className === 'dscResults') {
                    decryptRows();
                    decryptColumns();
                }
            });
            observer.observe(targetNode, { attributes: true, childList: true });

            function afterFetch(span, data, COLOR) {
                span.innerText = data;
                span.style.color = COLOR.RED;
            }
            sendResponse({ farewell: "goodbye" });
        }
    });




// (function mainApp(utilities) {




// }(UTIL.string));