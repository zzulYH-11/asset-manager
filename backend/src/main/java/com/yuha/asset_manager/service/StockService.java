package com.yuha.asset_manager.service;

import com.yuha.asset_manager.DTO.*;
import com.yuha.asset_manager.common.ErrorCode;
import com.yuha.asset_manager.common.Exception.NotFoundException;
import com.yuha.asset_manager.entity.Member;
import com.yuha.asset_manager.entity.Stock;
import com.yuha.asset_manager.repository.StockRepository;
import com.yuha.asset_manager.repository.MemberRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StockService {

    private final StockRepository stockRepository;
    private final MemberRepository memberRepository;

    @Autowired
    public StockService(MemberRepository memberRepository, StockRepository stockRepository) {
        this.stockRepository = stockRepository;
        this.memberRepository = memberRepository;
    }

    public FindAllStockResponse findAllStock(Long memberId) {

        // 존재하는 멤버인지 확인
        Optional<Member> memberById = memberRepository.findById(memberId);
        if(memberById.isEmpty()) throw new NotFoundException(ErrorCode.MEMBER_NOT_FOUND);

        // 존재하면 멤버의 모든 주식 가져오기
        List<Stock> allStocksById = stockRepository.findByMemberMemberId(memberId);

        // DTO에 담기
        FindAllStockResponse findAllStockResponse = new FindAllStockResponse();

        for(Stock stock : allStocksById) {
            findAllStockResponse.stockList.add(StockDTO.from(stock));
        }

        return findAllStockResponse;
    }

    public StockDTO addStock(Long memberId, AddStockRequest addStockRequest) {

        // 존재하는 멤버인지 확인
        Optional<Member> memberById = memberRepository.findById(memberId);
        if(memberById.isEmpty()) throw new NotFoundException(ErrorCode.MEMBER_NOT_FOUND);

        // 이미 존재하는 주식인지 확인
        Stock existingStock = stockRepository.findByMemberMemberIdAndTicker(memberId, addStockRequest.ticker());
        if (existingStock != null) throw new NotFoundException(ErrorCode.STOCK_ALREADY_EXIST);

        // Stock 엔티티 만들기
        Stock stock = Stock.builder()
                .member(memberById.get())
                .ticker(addStockRequest.ticker())
                .purchasePrice(addStockRequest.price())
                .quantity(addStockRequest.quantity())
                .build();

        // 만든 엔티티 저장
        stockRepository.save(stock);

        return StockDTO.from(stock);
    }

    @Transactional
    public StockDTO updateStock(long memberId, long stockId, EditStockRequest editStockRequest) {

        // 존재하는 멤버인지 확인
        Optional<Member> memberById = memberRepository.findById(memberId);
        if(memberById.isEmpty()) throw new NotFoundException(ErrorCode.MEMBER_NOT_FOUND);

        // 존재하는 주식인지 확인
        Stock stock = stockRepository.findByMemberMemberIdAndStockId(memberId, stockId);
        if (stock == null) throw new NotFoundException(ErrorCode.STOCK_NOT_FOUND);

        // 검증 통과하면 엔티티 정보 수정
        stock.setQuantity(editStockRequest.quantity());
        stock.setPurchasePrice(editStockRequest.price());

        return StockDTO.from(stock);
    }

    public DeleteStockResponse deleteStock(long memberId, long stockId) {

        // 존재하는 멤버인지 확인
        Optional<Member> memberById = memberRepository.findById(memberId);
        if(memberById.isEmpty()) throw new NotFoundException(ErrorCode.MEMBER_NOT_FOUND);

        // 존재하는 주식인지 확인
        Stock stock = stockRepository.findByMemberMemberIdAndStockId(memberId, stockId);
        if (stock == null) throw new NotFoundException(ErrorCode.STOCK_NOT_FOUND);

        // 검증 통괗하면 삭제
        stockRepository.deleteById(stockId);

        return new DeleteStockResponse(stockId);
    }
}
