// 学年別・教科別の教材データ生成関数
function generateMaterialsData() {
    let idCounter = 1;
    
    const createMaterial = (title, fileName, subject, grade, type, description, path) => ({
        id: idCounter++,
        title,
        fileName,
        subject,
        grade,
        type,
        description,
        uploadDate: '2025-12-20',
        fileSize: '2.5 MB',
        fileType: (fileName.split('.').pop() || 'PDF').toUpperCase(),
        icon: type === '問題集' ? '📐' : type === '解答・解説' ? '📋' : type === '動画' ? '🎥' : '📝',
        downloaded: false,
        isNew: true,
        path
    });

    const sokudokuMaterials = [
        ...Array.from({ length: 70 }, (_, i) => {
            const no = i + 1;
            return createMaterial(
                `速読英単語 ${no}`,
                `${no}.pdf`,
                '速読英単語',
                '問題集',
                '教材',
                `速読英単語の第${no}章です。`,
                `materiars/mondaishu/English/Sokudokueitango/PDF_Files/${no}.pdf`
            );
        }),
        createMaterial(
            '速読英単語 TanakaDojo',
            'TanakaDojo.pdf',
            '速読英単語',
            '問題集',
            '教材',
            '速読英単語の補助教材です。',
            'materiars/mondaishu/English/Sokudokueitango/PDF_Files/TanakaDojo.pdf'
        )
    ];

    return {
        '中1': {
            '数学(一貫)': [
                createMaterial('中1体系数学 問題集 代数', 'Taikeisuugaku_daisu_JrHS_1_work.pdf', '数学(一貫)', '中1', '問題集', '中学1年生の代数分野の体系数学問題集です。', 'materiars/JrHighSchool_1/Taikeisuugaku_daisu_JrHS_1_work.pdf'),
                createMaterial('中1体系数学 問題集 代数（解説）', 'Taikeisuugaku_daisu_JrHS_1_answer.pdf', '数学(一貫)', '中1', '解答・解説', '代数問題集の詳細な解説です。', 'materiars/JrHighSchool_1/Taikeisuugaku_daisu_JrHS_1_answer.pdf'),
                createMaterial('中1体系数学 問題集 幾何', 'Taikeisuugaku_kika_JrHS_1_work.pdf', '数学(一貫)', '中1', '問題集', '中学1年生の幾何分野の体系数学問題集です。', 'materiars/JrHighSchool_1/Taikeisuugaku_kika_JrHS_1_work.pdf'),
                createMaterial('中1体系数学 問題集 幾何（解説）', 'Taikeisuugaku_kika_JrHS_1_answer.pdf', '数学(一貫)', '中1', '解答・解説', '幾何問題集の詳細な解説です。', 'materiars/JrHighSchool_1/Taikeisuugaku_kika_JrHS_1_answer.pdf')
            ],
            '英語(一貫)': [
                createMaterial('WinPass 英語 中1', 'WinPass_English_JrHS_1_work.pdf', '英語(一貫)', '中1', '問題集', '中学1年生向けWinPass英語問題集です。', 'materiars/JrHighSchool_1/WinPass_English_JrHS_1_work.pdf'),
                createMaterial('WinPass 英語 中1（解説）', 'WinPass_English_JrHS_1_answer.pdf', '英語(一貫)', '中1', '解答・解説', 'WinPass英語問題集の解答解説です。', 'materiars/JrHighSchool_1/WinPass_English_JrHS_1_answer.pdf')
            ]
        },
        '中2': {
            '数学(一貫)': [
                createMaterial('中2体系数学 問題集 代数', 'Taikeisuugaku_daisu_JrHS_1_work.pdf', '数学(一貫)', '中2', '問題集', '中学2年生の代数分野の体系数学問題集です。', 'materiars/JrHighSchool_2/Taikeisuugaku_daisu_JrHS_1_work.pdf'),
                createMaterial('中2体系数学 問題集 代数（解説）', 'Taikeisuugaku_daisu_JrHS_1_answer.pdf', '数学(一貫)', '中2', '解答・解説', '代数問題集の詳細な解説です。', 'materiars/JrHighSchool_2/Taikeisuugaku_daisu_JrHS_1_answer.pdf'),
                createMaterial('中2体系数学 問題集 幾何', 'Taikeisuugaku_kika_JrHS_2_work.pdf', '数学(一貫)', '中2', '問題集', '中学2年生の幾何分野の体系数学問題集です。', 'materiars/JrHighSchool_2/Taikeisuugaku_kika_JrHS_2_work.pdf'),
                createMaterial('中2体系数学 問題集 幾何（解説）', 'Taikeisuugaku_kika_JrHS_1_answer.pdf', '数学(一貫)', '中2', '解答・解説', '幾何問題集の解答です。', 'materiars/JrHighSchool_2/Taikeisuugaku_kika_JrHS_1_answer.pdf')
            ],
            '英語(一貫)': [
                createMaterial('WinPass 英語 中2', 'WinPass_English_JrHS_2_work.pdf', '英語(一貫)', '中2', '問題集', '中学2年生向けWinPass英語問題集です。', 'materiars/JrHighSchool_2/WinPass_English_JrHS_2_work.pdf'),
                createMaterial('WinPass 英語 中2（解説）', 'WinPass_English_JrHS_2_answer.pdf', '英語(一貫)', '中2', '解答・解説', 'WinPass英語問題集の解答解説です。', 'materiars/JrHighSchool_2/WinPass_English_JrHS_2_answer.pdf')
            ]
        },
        '中3': {
            '英語(一貫)': [
                createMaterial('WinPass 英語 中3', 'WinPass_English_JrHS_3_work.pdf', '英語(一貫)', '中3', '問題集', '中学3年生向けWinPass英語問題集です。', 'materiars/JrHighSchool_3/WinPass_English_JrHS_3_work.pdf'),
                createMaterial('WinPass 英語 中3（解説）', 'WinPass_English_JrHS_3_answer.pdf', '英語(一貫)', '中3', '解答・解説', 'WinPass英語問題集の解答解説です。', 'materiars/JrHighSchool_3/WinPass_English_JrHS_3_answer.pdf'),
                createMaterial('中3 春休み課題 数学', 'Math.pdf', '数学', '中3', '問題集', '中3春休み課題の数学です。', 'materiars/JrHighSchool_3/JrHS_3_spring_homework/Math.pdf'),
                createMaterial('中3 春休み課題 数学（解答）', 'LINE_ALBUM_中3数学解答_250314_1.jpg', '数学', '中3', '解答・解説', '中3春休み課題 数学の解答です。', 'materiars/JrHighSchool_3/JrHS_3_spring_homework/解答_数学/LINE_ALBUM_中3数学解答_250314_1.jpg'),
                createMaterial('中3 春休み課題 英語（文法）', 'EnglishGrammar.pdf', '英語', '中3', '問題集', '中3春休み課題の英語文法です。', 'materiars/JrHighSchool_3/JrHS_3_spring_homework/EnglishGrammar.pdf'),
                createMaterial('中3 春休み課題 英語（文法）解答', 'LINE_ALBUM_中3英語解答_250314_1.jpg', '英語', '中3', '解答・解説', '中3春休み課題 英語文法の解答です。', 'materiars/JrHighSchool_3/JrHS_3_spring_homework/解答_英語(文法)/LINE_ALBUM_中3英語解答_250314_1.jpg')
            ]
        },
        '高1': {
            '数学(一貫)': [
                createMaterial('4プロセス 数ⅠA 問題', '4Processes_Math1A_Problems_2022.pdf', '数学(一貫)', '高1', '問題集', '数学ⅠAの4プロセス問題集です。', 'materiars/4pro/Math1A/4Processes_Math1A_Problems_2022.pdf'),
                createMaterial('4プロセス 数ⅠA 解答', '4Processes_Math1A_Answers_2022.pdf', '数学(一貫)', '高1', '解答・解説', '数学ⅠAの4プロセス解答です。', 'materiars/4pro/Math1A/4Processes_Math1A_Answers_2022.pdf'),
                createMaterial('4プロセス 数ⅡB 問題', '4Processes_Math2B_2022.pdf', '数学(一貫)', '高1', '問題集', '数学ⅡBの4プロセス問題集です。', 'materiars/4pro/Math2B/4Processes_Math2B_2022.pdf'),
                createMaterial('4プロセス 数ⅡB 解説', '4Processes_Math2B_Answers_2022.pdf', '数学(一貫)', '高1', '解答・解説', '数学ⅡBの4プロセス解説です。', 'materiars/4pro/Math2B/4Processes_Math2B_Answers_2022.pdf')
            ],
            '英語(一貫)': [
                createMaterial('Evergreen English Grammar 25Lessons', 'Evergreen English Grammar 25Lessons.pdf', '英語(一貫)', '高1', '問題集', 'Evergreen文法テキストです。', 'materiars/HighSchool_1/Evergreen/Grammer/Evergreen English Grammar 25Lessons.pdf'),
                createMaterial('Evergreen English Grammar 25Lessons（解答）', 'Evergreen English Grammar 25Lessons_Answer.pdf', '英語(一貫)', '高1', '解答・解説', 'Evergreen文法解答です。', 'materiars/HighSchool_1/Evergreen/Grammer/Evergreen English Grammar 25Lessons_Answer.pdf'),
                createMaterial('Evergreen English Grammar Workbook', 'Evergreen English Grammar 25Lessons Workbook.pdf', '英語(一貫)', '高1', '問題集', 'Evergreen文法ワークブックです。', 'materiars/HighSchool_1/Evergreen/Workbook/Evergreen English Grammar 25Lessons Workbook.pdf'),
                createMaterial('Evergreen English Grammar Workbook（解答）', 'Evergreen English Grammar 25Lessons Workbook_Answer.pdf', '英語(一貫)', '高1', '解答・解説', 'Evergreen文法ワークブック解答です。', 'materiars/HighSchool_1/Evergreen/Workbook/Evergreen English Grammar 25Lessons Workbook_Answer.pdf'),
                createMaterial('DUALSCOPE 英文法 Workbook', 'DUALSCOPE English Grammer in 27 Stages Workbook.pdf', '英語(一貫)', '高1', '問題集', 'DUALSCOPE英文法ワークブックです。', 'materiars/HighSchool_1/DUALSCOPE/DUALSCOPE English Grammer in 27 Stages Workbook.pdf'),
                createMaterial('DUALSCOPE 英文法 Workbook（解答）', 'DUALSCOPE English Grammer in 27 Stages Workbook_Answer(1).pdf', '英語(一貫)', '高1', '解答・解説', 'DUALSCOPE英文法ワークブック解答です。', 'materiars/HighSchool_1/DUALSCOPE/DUALSCOPE English Grammer in 27 Stages Workbook_Answer(1).pdf')
            ]
        },
        '高2': {
            '数学(一貫)': [
                createMaterial('4プロセス 数ⅠA 問題', '4Processes_Math1A_Problems_2022.pdf', '数学(一貫)', '高2', '問題集', '数学ⅠAの4プロセス問題集です。', 'materiars/4pro/Math1A/4Processes_Math1A_Problems_2022.pdf'),
                createMaterial('4プロセス 数ⅠA 解答', '4Processes_Math1A_Answers_2022.pdf', '数学(一貫)', '高2', '解答・解説', '数学ⅠAの4プロセス解答です。', 'materiars/4pro/Math1A/4Processes_Math1A_Answers_2022.pdf'),
                createMaterial('4プロセス 数ⅡB 問題', '4Processes_Math2B_2022.pdf', '数学(一貫)', '高2', '問題集', '数学ⅡBの4プロセス問題集です。', 'materiars/4pro/Math2B/4Processes_Math2B_2022.pdf'),
                createMaterial('4プロセス 数ⅡB 解説', '4Processes_Math2B_Answers_2022.pdf', '数学(一貫)', '高2', '解答・解説', '数学ⅡBの4プロセス解説です。', 'materiars/4pro/Math2B/4Processes_Math2B_Answers_2022.pdf'),
                createMaterial('4プロセス 数ⅢC 問題', '4Processes_Math3C_Problems_2024.pdf', '数学(一貫)', '高2', '問題集', '数学ⅢCの4プロセス問題集です。', 'materiars/4pro/Math3C/4Processes_Math3C_Problems_2024.pdf'),
                createMaterial('4プロセス 数ⅢC 解答', '4Processes_Math3C_Answers_2024.pdf', '数学(一貫)', '高2', '解答・解説', '数学ⅢCの4プロセス解答です。', 'materiars/4pro/Math3C/4Processes_Math3C_Answers_2024.pdf')
            ],
            '英語(一貫)': [
                createMaterial('VisionQuest論理表現Ⅱワークブック', 'VisionQuestHope_LogicExpression2_Workbook.pdf', '英語(一貫)', '高2', '問題集', 'VisionQuest論理表現ワークブックです。', 'materiars/HighSchool_2/Vision quest hope/VisionQuestHope_LogicExpression2_Workbook.pdf'),
                createMaterial('VisionQuest論理表現Ⅱワークブック（解答）', 'VisionQuestHope_LogicExpression2_Workbook_Answer.pdf', '英語(一貫)', '高2', '解答・解説', 'VisionQuest論理表現ワークブック解答です。', 'materiars/HighSchool_2/Vision quest hope/VisionQuestHope_LogicExpression2_Workbook_Answer.pdf')
            ]
        },
        '高3': {
            '数学(一貫)': [
                createMaterial('4プロセス 数ⅠA 問題', '4Processes_Math1A_Problems_2022.pdf', '数学(一貫)', '高3', '問題集', '数学ⅠAの4プロセス問題集です。', 'materiars/4pro/Math1A/4Processes_Math1A_Problems_2022.pdf'),
                createMaterial('4プロセス 数ⅠA 解答', '4Processes_Math1A_Answers_2022.pdf', '数学(一貫)', '高3', '解答・解説', '数学ⅠAの4プロセス解答です。', 'materiars/4pro/Math1A/4Processes_Math1A_Answers_2022.pdf'),
                createMaterial('4プロセス 数ⅡB 問題', '4Processes_Math2B_2022.pdf', '数学(一貫)', '高3', '問題集', '数学ⅡBの4プロセス問題集です。', 'materiars/4pro/Math2B/4Processes_Math2B_2022.pdf'),
                createMaterial('4プロセス 数ⅡB 解説', '4Processes_Math2B_Answers_2022.pdf', '数学(一貫)', '高3', '解答・解説', '数学ⅡBの4プロセス解説です。', 'materiars/4pro/Math2B/4Processes_Math2B_Answers_2022.pdf'),
                createMaterial('4プロセス 数ⅢC 問題', '4Processes_Math3C_Problems_2024.pdf', '数学(一貫)', '高3', '問題集', '数学ⅢCの4プロセス問題集です。', 'materiars/4pro/Math3C/4Processes_Math3C_Problems_2024.pdf'),
                createMaterial('4プロセス 数ⅢC 解答', '4Processes_Math3C_Answers_2024.pdf', '数学(一貫)', '高3', '解答・解説', '数学ⅢCの4プロセス解答です。', 'materiars/4pro/Math3C/4Processes_Math3C_Answers_2024.pdf')
            ]
        },
        '問題集': {
            '速読英単語': sokudokuMaterials
        },
        '過去問': {
            '共通テスト': [
                createMaterial('共通テスト 2026 数学I・A 問題', 'R6_問題_問題_数学Ⅰ・数学Ａ.pdf', '数学', '過去問', '過去問', '共通テスト2026の数学I・A問題です。', 'materiars/kakomon/Kyotsu_exam/2026/2025_op_26_sugaku1A.pdf'),
                createMaterial('共通テスト 2026 数学II・B 問題', 'R6_問題_問題_数学Ⅱ・数学Ｂ.pdf', '数学', '過去問', '過去問', '共通テスト2026の数学II・B問題です。', 'materiars/kakomon/Kyotsu_exam/2026/2025_op_30_sugaku2BC.pdf'),
                createMaterial('共通テスト 2026 英語リーディング', 'R6_問題_問題_リーディング.pdf', '英語', '過去問', '過去問', '共通テスト2026の英語リーディング問題です。', 'materiars/kakomon/Kyotsu_exam/2026/2025_op_20_reading.pdf'),
                createMaterial('共通テスト 2026 英語リスニング', 'R6_問題_問題_リスニング.pdf', '英語', '過去問', '過去問', '共通テスト2026の英語リスニング問題です。', 'materiars/kakomon/Kyotsu_exam/2026/2025_op_25_listening.pdf')
            ],
            '早稲田大学': [
                createMaterial('早稲田大学 先進理工 英語', 'eigo.pdf', '英語', '過去問', '過去問', '早稲田大学先進理工の英語過去問です。', 'materiars/kakomon/wasedadaigaku/ippan/kikan_souzou_sensinriko/2023/eigo.pdf'),
                createMaterial('早稲田大学 先進理工 数学', 'sugaku.pdf', '数学', '過去問', '過去問', '早稲田大学先進理工の数学過去問です。', 'materiars/kakomon/wasedadaigaku/ippan/kikan_souzou_sensinriko/2023/sugaku.pdf'),
                createMaterial('早稲田大学 先進理工 生物', 'seibutsu.pdf', '理科', '過去問', '過去問', '早稲田大学先進理工の生物過去問です。', 'materiars/kakomon/wasedadaigaku/ippan/kikan_souzou_sensinriko/2023/seibutsu.pdf')
            ]
        }
    };
}
