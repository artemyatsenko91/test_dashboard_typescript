import "../scss/style.scss";
import { IDataResponse, ITableInfo } from "./types";

window.addEventListener("load", async () => {
    const tableHeaderLine = document.querySelector(
        ".table_header_line"
    ) as HTMLTableRowElement;
    const table = document.querySelector("table") as HTMLTableElement;
    const sideMenu = document.querySelector(".side-menu") as HTMLElement;
    const dataInfo: IDataResponse = await getDataFromJson();

    async function getDataFromJson() {
        const response = await fetch("./data.json");

        return response.json();
    }

    function generateUsers(data: ITableInfo[]) {
        const existingTableLines = document.querySelectorAll(".table_line");
        existingTableLines &&
            existingTableLines.forEach((line) => line.remove());

        const existingTableLinesMob =
            document.querySelectorAll(".table_line_mob");
        existingTableLinesMob &&
            existingTableLinesMob.forEach((line) => line.remove());

        let template = "";

        function capitalizeFirstLetter(string: string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        data.map((item) => {
            if (window.innerWidth >= 850) {
                template += `
                    <tr class="table_line">
                        <td>${item.name}</td>
                        <td>${item.company}</td>
                        <td><a href="tel:${item.phone}">${item.phone}</a></td>
                        <td><a href="mailto:${item.email}">${
                    item.email
                }</a></td>
                        <td>${item.country}</td>
                        <td>
                            <button class="status_btn ${item.status}">
                                ${capitalizeFirstLetter(item.status)}
                            </button>
                        </td>
                    </tr>`;
            } else {
                template += `
                    <tr class="table_line_mob">
                        <td class="table_link">${item.name}</td>
                        <td>
                            <button class="status_btn ${item.status}">
                                ${capitalizeFirstLetter(item.status)}
                            </button>
                        </td>
                    </tr>`;
            }
        });
        tableHeaderLine.insertAdjacentHTML("afterend", template);
    }

    function showMoreAboutUser() {
        table.addEventListener("click", (e: MouseEvent) => {
            const userField = e.target as Element;
            if (userField.classList.contains("table_link")) {
                const name = userField.innerHTML;
                dataInfo.tableInfo.map((item) => {
                    if (item.name === name) {
                        userField.classList.add("open");
                        userField.setAttribute("data-id", item.name);
                        userField.innerHTML = `
                            <td class="table_link 2">
                                <div class="user-info">
                                    <button class="hide_user_info">Hide</button>
                                    <div class="user-info__row">
                                        <span class="user-info__title">Name:</span>
                                        <span class="user-info__text">${item.name}</span>
                                    </div>
                                    <div class="user-info__row">
                                        <span class="user-info__title">Company:</span>
                                        <span class="user-info__text">${item.company}</span>
                                    </div>
                                    <div class="user-info__row link__row">
                                        <span class="user-info__title">Phone Number:</span>
                                        <a class="user-info__text" href="tel:${item.phone}">${item.phone}</a>
                                    </div>
                                    <div class="user-info__row link__row">
                                        <span class="user-info__title">Email:</span>
                                        <a class="user-info__text" href="mailto:${item.email}">${item.email}</a>
                                    </div>
                                    <div class="user-info__row">
                                        <span class="user-info__title">Country:</span>
                                        <span class="user-info__text">${item.country}</span>
                                    </div>
                                </>
                            </td>`;
                        hideUserInfo(item.name);
                    }
                });
            }
        });
    }

    function hideUserInfo(name: string) {
        const hideInfoBtns = document.querySelectorAll(
            ".hide_user_info"
        ) as NodeListOf<HTMLButtonElement>;
        hideInfoBtns.forEach((hideInfoBtn) => {
            hideInfoBtn.addEventListener("click", (e: MouseEvent) => {
                const target = e.target as Element;
                const userTableRow = target.closest("[data-id]") as HTMLElement;
                userTableRow.classList.remove("open");
                userTableRow.innerHTML = `<td class="table_link">${name}</td>`;
            });
        });
    }

    function generateTableHeaders() {
        let template = "";
        dataInfo.tableHeaders.map((item) => {
            if (window.innerWidth >= 850) {
                template += `<th> ${item.name}</th > `;
            } else {
                if (item.name === "Customer Name" || item.name === "Status") {
                    template += `<th>${item.name}</th> `;
                }
            }
        });

        tableHeaderLine.innerHTML = template;
        toggleListItemActivity();
    }

    function toggleStatusActivity() {
        table.addEventListener("click", (e: MouseEvent) => {
            const target = e.target as HTMLButtonElement;
            if (target.classList.contains("status_btn")) {
                if (target.classList.contains("active")) {
                    target.classList.remove("active");
                    target.classList.add("inactive");
                    target.innerHTML = "Inactive";
                } else {
                    target.classList.remove("inactive");
                    target.classList.add("active");
                    target.innerHTML = "Active";
                }
            }
        });
    }

    function showSideMenu() {
        const btnShowMenu = document.querySelector(
            ".btn_show_menu"
        ) as HTMLButtonElement;
        const body = document.body;

        btnShowMenu.addEventListener("click", () => {
            sideMenu.classList.toggle("show");
            if (sideMenu.classList.contains("show")) {
                body.classList.add("no_scroll");
                btnShowMenu.innerHTML = "<";
            } else {
                body.classList.remove("no_scroll");
                btnShowMenu.innerHTML = ">";
            }
        });
    }

    function removeUsers() {
        const usersInfo = document.querySelectorAll(".table_line");

        usersInfo &&
            usersInfo.forEach((item) => {
                item.remove();
            });
    }

    function toggleListItemActivity() {
        const listWrapper = document.querySelector(
            ".side-menu__list"
        ) as HTMLUListElement;

        listWrapper.addEventListener("click", (e) => {
            const itemList = listWrapper.querySelectorAll(".list-item");
            const listItem = e.target as HTMLLIElement;

            const closestParent = listItem.closest(
                ".list-item"
            ) as HTMLLIElement;

            itemList.forEach((item) => {
                item.classList.remove("active");

                if (
                    closestParent.getAttribute("data-name") ===
                    item.getAttribute("data-name")
                ) {
                    closestParent.classList.add("active");
                }
            });

            sideMenu.classList.contains("show") &&
                sideMenu.classList.remove("show");
        });
    }

    function search() {
        const searchInput = document.querySelector(
            ".header__search-input"
        ) as HTMLInputElement;

        searchInput.addEventListener("input", () => {
            let searchStr = searchInput.value;
            const searchValue = searchStr.trim().toLowerCase();
            const filteredData = dataInfo.tableInfo.filter((item) => {
                const itemFields: Array<keyof ITableInfo> = Object.keys(
                    item
                ) as Array<keyof ITableInfo>;

                for (const key of itemFields) {
                    if (key !== "id" && key !== "status") {
                        const isMatch = item[key]
                            .toLowerCase()
                            .includes(searchValue);

                        if (isMatch) return item;
                        else continue;
                    }
                }
            });

            removeUsers();
            generateUsers(filteredData);
        });
    }

    window.addEventListener("resize", () => {
        generateUsers(dataInfo.tableInfo);
        generateTableHeaders();
    });

    showSideMenu();
    search();
    toggleStatusActivity();
    generateUsers(dataInfo.tableInfo);
    showMoreAboutUser();
    generateTableHeaders();
});
